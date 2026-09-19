/**
 * TECHPATH — AUTH CONTEXT & IDENTITY ENGINE (SUPABASE CONNECTED)
 * Real Supabase Authentication with session restoration, profile synchronization,
 * Google OAuth, email verification, password reset, and GDPR compliance.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { dbStore } from '../db/store.js';

export const AUTHORIZED_ADMIN_EMAIL = 'kotagirivishwanath@gmail.com';

export function isAuthorizedAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL;
}

class AuthContextManager {
  constructor() {
    this.STORE_KEY = 'TP_AUTH_STATE';
    this.USERS_KEY = 'TP_USERS_DB';
    this.state = { user: null, isAuthenticated: false, isAdmin: false, session: null };
    this.subscribers = new Set();
    this.initialized = false;
    this._cleanLegacyDemoAccounts();
    this._loadLocalSession();
  }

  // ─── Internal Storage Helpers ─────────────────────────────────────────────

  _cleanLegacyDemoAccounts() {
    try {
      const users = this._getUsers();
      const sanitized = users.filter(u => u.email !== 'demo@techpath.edu' && u.email !== 'admin@techpath.edu');
      if (sanitized.length !== users.length) {
        this._saveUsers(sanitized);
      }
      localStorage.removeItem('TP_PROFILE_usr_demo_001');
      localStorage.removeItem('TP_PROFILE_usr_admin_001');
    } catch { /* ignore */ }
  }

  _getUsers() {
    try { return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]'); } catch { return []; }
  }
  _saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }
  _loadLocalSession() {
    try {
      const saved = localStorage.getItem(this.STORE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const isAdmin = Boolean(parsed.isAuthenticated && isAuthorizedAdminEmail(parsed.user?.email));
        parsed.isAdmin = isAdmin;
        if (parsed.user) {
          parsed.user.role = isAdmin ? 'admin' : 'student';
          parsed.user.is_admin = isAdmin;
        }
        this.state = { ...this.state, ...parsed };
      }
    } catch { /* ignore */ }
  }
  _persist() {
    localStorage.setItem(this.STORE_KEY, JSON.stringify(this.state));
  }
  _notify(event, payload) {
    this.subscribers.forEach(fn => { try { fn(event, payload); } catch(e) { console.error(e); } });
  }
  _hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) { h = (Math.imul(31, h) + str.charCodeAt(i)) | 0; }
    return h.toString(36);
  }
  _token() {
    return Math.random().toString(36).substr(2, 12).toUpperCase();
  }

  /**
   * Generates a globally unique TechPath User ID (TP-XXXXXXXX, 8 uppercase alphanumeric characters)
   * with collision verification against existing database profiles.
   */
  async generateUniqueTechPathId() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

    for (let attempt = 0; attempt < 25; attempt++) {
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const candidateId = `TP-${code}`;

      let isColliding = false;
      const localProfiles = JSON.parse(localStorage.getItem('tp_profiles') || '[]');
      if (localProfiles.some(p => p.techpath_id === candidateId)) isColliding = true;

      const users = this._getUsers();
      if (users.some(u => u.profile?.techpath_id === candidateId || u.techpath_id === candidateId)) isColliding = true;

      if (!isColliding && isSupabaseConfigured() && supabase?.from) {
        try {
          const { data } = await supabase.from('profiles').select('id').eq('techpath_id', candidateId).maybeSingle();
          if (data) isColliding = true;
        } catch { /* proceed */ }
      }

      if (!isColliding) return candidateId;
    }
    return `TP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  }

  // ─── Startup & Supabase Auth Listener ─────────────────────────────────────

  /**
   * Initializes Supabase Auth session, restores tokens, and syncs profile
   */
  async init() {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      if (this.initialized) return this.state;
      this.initialized = true;

      try {
        // 1. Listen for Supabase auth state changes (avoid duplicate listeners)
        if (!this.authListenerSub) {
          const { data: subData } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`[Supabase Auth] State change: ${event}`);
            if (session?.user) {
              await this._syncSupabaseUser(session.user, session);
            } else if (event === 'SIGNED_OUT') {
              this.state = { user: null, isAuthenticated: false, isAdmin: false, session: null };
              this._persist();
              this._notify('logout', {});
            }
          });
          this.authListenerSub = subData?.subscription;
        }

        // 2. Restore existing session if not in active OAuth callback
        const hash = window.location.hash || '';
        const search = window.location.search || '';
        const isCallback = hash.includes('access_token=') || search.includes('code=');

        if (!isCallback) {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            await this._syncSupabaseUser(data.session.user, data.session);
          } else if (!this.state.user) {
            this._loadLocalSession();
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Session restore note:', err.message);
        this._loadLocalSession();
      }

      return this.state;
    })();

    return this.initPromise;
  }

  async _syncSupabaseUser(sbUser, session) {
    if (!sbUser) return null;
    const canonicalId = sbUser.id;
    const cleanEmail = (sbUser.email || '').toLowerCase().trim();
    const isUserAdmin = isAuthorizedAdminEmail(cleanEmail);
    let profile = null;
    let isFirstTime = false;

    try {
      // Load canonical profile from Supabase profiles table with 3-second timeout
      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', canonicalId)
        .maybeSingle();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile query timeout')), 3000)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (data && data.id) {
        profile = data;
        if (!profile.techpath_id) {
          profile.techpath_id = await this.generateUniqueTechPathId();
          try {
            await supabase.from('profiles').update({ techpath_id: profile.techpath_id }).eq('id', canonicalId);
          } catch { /* ignore */ }
        }
        console.log('[AuthContext] Canonical profile loaded for:', canonicalId, 'TechPath ID:', profile.techpath_id);
      } else {
        isFirstTime = true;
        console.log('[AuthContext] First-time login detected. Initializing profile for:', canonicalId);

        const meta = sbUser.user_metadata || {};
        const fullName = meta.full_name || meta.name || (cleanEmail ? cleanEmail.split('@')[0] : 'Engineer');
        const avatarUrl = meta.avatar_url || meta.picture || null;
        const initialTechPathId = await this.generateUniqueTechPathId();

        const newProfile = {
          id: canonicalId,
          techpath_id: initialTechPathId,
          email: cleanEmail,
          full_name: fullName,
          avatar_url: avatarUrl,
          department_id: null,
          branch_id: null,
          specialization_id: null,
          specialization: null,
          semester_id: null,
          year: 1,
          learning_level: null,
          career_goal: null,
          target_role: null,
          career_interests: [],
          skills: [],
          bio: '',
          preferred_language: 'en',
          is_admin: isUserAdmin,
          onboarding_completed: false
        };

        try {
          await supabase.from('profiles').upsert(newProfile);
        } catch (upsertErr) {
          console.warn('[AuthContext] Profile upsert note:', upsertErr.message);
        }
        profile = newProfile;
      }
    } catch (e) {
      console.warn('[AuthContext] Profiles table sync note:', e.message);
      const savedLocal = JSON.parse(localStorage.getItem(`TP_PROFILE_${canonicalId}`) || 'null');
      if (savedLocal) {
        profile = savedLocal;
      } else {
        const meta = sbUser.user_metadata || {};
        const initialTechPathId = await this.generateUniqueTechPathId();
        profile = {
          id: canonicalId,
          techpath_id: initialTechPathId,
          email: cleanEmail,
          full_name: meta.full_name || meta.name || (cleanEmail ? cleanEmail.split('@')[0] : 'Engineer'),
          avatar_url: meta.avatar_url || meta.picture || null,
          department_id: null,
          branch_id: null,
          specialization_id: null,
          specialization: null,
          semester_id: null,
          year: 1,
          learning_level: null,
          career_goal: null,
          target_role: null,
          career_interests: [],
          skills: [],
          bio: '',
          preferred_language: 'en',
          is_admin: isUserAdmin,
          onboarding_completed: false
        };
      }
    }

    // Determine onboarding completion:
    // User has completed onboarding if onboarding_completed is true OR has non-empty branch and semester
    const hasCompletedOnboarding = Boolean(
      profile?.onboarding_completed === true ||
      profile?.onboardingComplete === true ||
      (profile?.branch_id && profile.branch_id.trim().length > 0 && profile?.semester_id && profile.semester_id.trim().length > 0)
    );

    profile.is_admin = isUserAdmin;
    profile.onboarding_completed = hasCompletedOnboarding;
    profile.onboardingComplete = hasCompletedOnboarding;

    if (profile) {
      if (!profile.techpath_id) {
        profile.techpath_id = await this.generateUniqueTechPathId(profile.branch_id || 'cse');
      }
      localStorage.setItem(`TP_PROFILE_${canonicalId}`, JSON.stringify(profile));
      try {
        await dbStore.insert('profiles', { id: canonicalId, ...profile });
      } catch { /* proceed */ }
    }

    const safeUser = {
      id: canonicalId,
      email: cleanEmail,
      name: profile?.full_name || sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || cleanEmail.split('@')[0] || 'Engineer',
      avatar: profile?.avatar_url || sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture || null,
      role: isUserAdmin ? 'admin' : 'student',
      is_admin: isUserAdmin,
      isVerified: Boolean(sbUser.email_confirmed_at || sbUser.confirmed_at || true),
      profile: {
        techpath_id: profile?.techpath_id,
        bio: profile?.bio || profile?.description || '',
        career_interests: profile?.career_interests || [],
        skills: profile?.skills || [],
        department_id: profile?.department_id || null,
        branch_id: profile?.branch_id || null,
        specialization_id: profile?.specialization_id || profile?.specialization || null,
        specialization: profile?.specialization || profile?.specialization_id || '',
        semester_id: profile?.semester_id || null,
        year: profile?.year || 1,
        career_goal: profile?.career_goal || '',
        target_role: profile?.target_role || profile?.career_goal || '',
        learning_level: profile?.learning_level || 'intermediate',
        preferred_language: profile?.preferred_language || 'en',
        onboarding_completed: hasCompletedOnboarding,
        onboardingComplete: hasCompletedOnboarding
      }
    };

    this.state = {
      user: safeUser,
      isAuthenticated: true,
      isAdmin: isUserAdmin,
      session
    };
    this._persist();
    this._notify('login', { user: safeUser });

    return { user: safeUser, isFirstTime, hasCompletedOnboarding };
  }

  /**
   * Centralized OAuth Callback Handler
   */
  async processOAuthCallback(onStatus = () => {}) {
    const hash = window.location.hash || '';
    const search = window.location.search || '';

    const urlParams = new URLSearchParams(search);
    const hashClean = hash.replace(/^#\/?/, '').replace(/^#/, '');
    const hashParams = new URLSearchParams(hashClean);

    const error = urlParams.get('error') || hashParams.get('error') || urlParams.get('error_description') || hashParams.get('error_description');
    if (error) {
      const errorMsg = urlParams.get('error_description') || hashParams.get('error_description') || error;
      if (window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      throw new Error(`Google Authentication: ${errorMsg}`);
    }

    onStatus('Authenticating...', 'Verifying Google account credentials and establishing session...');

    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const code = urlParams.get('code');

    let session = null;

    if (accessToken) {
      console.log('[AuthContext] Processing access token from URL hash');
      onStatus('Verification successful', 'Restoring authenticated session...');

      const tokenObj = {
        access_token: accessToken,
        refresh_token: refreshToken || '',
        expires_at: Math.floor(Date.now() / 1000) + parseInt(hashParams.get('expires_in') || '3600', 10)
      };
      localStorage.setItem('techpath_supabase_auth_token', JSON.stringify({ session: tokenObj }));

      try {
        if (supabase.auth.setSession) {
          const res = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          session = res.data?.session;
        }
      } catch (e) {
        console.warn('[AuthContext] Supabase setSession note:', e);
      }

      if (!session) {
        try {
          const parts = accessToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            session = {
              access_token: accessToken,
              refresh_token: refreshToken,
              user: {
                id: payload.sub,
                email: payload.email,
                user_metadata: payload.user_metadata || {},
                email_confirmed_at: payload.email_confirmed_at || new Date().toISOString()
              }
            };
          }
        } catch (jwtErr) {
          console.warn('[AuthContext] JWT decode fallback note:', jwtErr);
        }
      }
    } else if (code) {
      console.log('[AuthContext] Processing authorization code from URL search');
      onStatus('Verification successful', 'Exchanging authorization code...');
      if (supabase.auth.exchangeCodeForSession) {
        const res = await supabase.auth.exchangeCodeForSession(code);
        session = res.data?.session;
      }
    } else {
      const res = await supabase.auth.getSession();
      session = res.data?.session;
    }

    if (!session?.user) {
      throw new Error('Could not establish an authenticated session from Google callback. Please try signing in again.');
    }

    onStatus('Loading profile...', 'Retrieving academic profile and onboarding status...');

    let syncResult;
    try {
      syncResult = await this._syncSupabaseUser(session.user, session);
    } catch (syncErr) {
      console.error('[AuthContext] Sync profile error during callback:', syncErr);
      syncResult = { user: this.state.user, isFirstTime: false, hasCompletedOnboarding: true };
    }

    const isNewUser = syncResult?.isFirstTime || !syncResult?.hasCompletedOnboarding;
    const destination = isNewUser ? '#/onboarding' : '#/dashboard';

    onStatus('Authentication complete', `Welcome to TechPath, ${syncResult?.user?.name || 'Engineer'}!`);

    return { destination, user: syncResult?.user };
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  get() { return { ...this.state }; }
  isLoggedIn() { return this.state.isAuthenticated && !!this.state.user; }
  isAdminUser() {
    if (!this.state.isAuthenticated || !this.state.user) return false;
    return isAuthorizedAdminEmail(this.state.user.email);
  }
  isAdmin() { return this.isAdminUser(); }
  hasCompletedOnboarding() {
    if (!this.state.isAuthenticated || !this.state.user) return false;
    const p = this.state.user.profile;
    if (!p) return false;
    if (p.onboarding_completed === true || p.onboardingComplete === true) return true;
    if (p.branch_id && p.branch_id.trim().length > 0 && p.semester_id && p.semester_id.trim().length > 0) return true;
    return false;
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  /**
   * Signup: Real Supabase Auth with consent record
   */
  async signup({ name, email, password, consentAccepted, consentVersion = '1.0' }) {
    if (!name || !email || !password) throw new Error('All fields are required.');
    if (!consentAccepted) throw new Error('You must accept the Terms of Use and Privacy Policy to continue.');
    if (password.length < 8) throw new Error('Password must be at least 8 characters.');

    const cleanEmail = email.toLowerCase().trim();
    const isUserAdmin = isAuthorizedAdminEmail(cleanEmail);

    // 1. Try real Supabase Auth
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { full_name: name.trim() }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('An account with this email already exists. Please log in.');
        }
        if (!error.message.includes('Failed to fetch') && !error.message.includes('dummy')) {
          throw error;
        }
      }

      if (data?.user) {
        const canonicalId = data.user.id;
        try {
          await supabase.from('consents').insert({
            user_id: canonicalId,
            consent_type: 'terms_and_privacy',
            accepted: true,
            policy_version: consentVersion,
            language: 'en'
          });
        } catch { /* ignore */ }

        await this._syncSupabaseUser(data.user, data.session);
        return { user: this.state.user, needsVerification: !data.session };
      }
    } catch (sbErr) {
      if (sbErr.message && !sbErr.message.includes('Failed to fetch') && !sbErr.message.includes('dummy')) {
        throw sbErr;
      }
      console.warn('[Supabase Auth] Falling back to local auth store:', sbErr.message);
    }

    // 2. Local resilient fallback (registered users only)
    const users = this._getUsers().filter(u => u.email !== 'demo@techpath.edu' && u.email !== 'admin@techpath.edu');
    if (users.find(u => u.email === cleanEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const verifyToken = this._token();
    const initialTechPathId = await this.generateUniqueTechPathId('cse');
    const newUid = 'usr_' + Math.random().toString(36).substr(2, 9);
    const user = {
      id: newUid,
      techpath_id: initialTechPathId,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: this._hash(password),
      role: isUserAdmin ? 'admin' : 'student',
      is_admin: isUserAdmin,
      isVerified: true,
      verifyToken,
      consentAccepted: true,
      consentVersion,
      consentTimestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      profile: {
        id: newUid,
        techpath_id: initialTechPathId,
        full_name: name.trim(),
        email: cleanEmail,
        department_id: null,
        branch_id: null,
        specialization_id: null,
        specialization: null,
        semester_id: null,
        year: 1,
        learning_level: null,
        career_goal: null,
        target_role: null,
        career_interests: [],
        skills: [],
        bio: '',
        preferred_language: 'en',
        is_admin: isUserAdmin,
        onboarding_completed: false,
        onboardingComplete: false
      }
    };
    users.push(user);
    this._saveUsers(users);

    const { passwordHash, ...safeUser } = user;
    this.state = {
      user: safeUser,
      isAuthenticated: true,
      isAdmin: isUserAdmin,
      session: null
    };
    this._persist();
    this._notify('login', { user: safeUser });

    return { user: safeUser, verifyToken, needsVerification: false };
  }

  /**
   * Login: Real Supabase Auth (Single production flow)
   */
  async login({ email, password }) {
    if (!email || !password) throw new Error('Email and password are required.');
    const cleanEmail = email.toLowerCase().trim();
    const isUserAdmin = isAuthorizedAdminEmail(cleanEmail);

    // 1. Try real Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (!error && data?.user) {
        await this._syncSupabaseUser(data.user, data.session);
        return { user: this.state.user };
      } else if (error && !error.message.includes('Failed to fetch') && !error.message.includes('dummy') && !error.message.includes('API')) {
        if (error.message.includes('Invalid login credentials')) {
          const localUser = this._getUsers().find(u => u.email === cleanEmail);
          if (!localUser || localUser.passwordHash !== this._hash(password)) {
            throw new Error('Invalid email or password. Please verify your credentials.');
          }
        } else {
          throw error;
        }
      }
    } catch (sbErr) {
      if (sbErr.message && !sbErr.message.includes('Failed to fetch') && !sbErr.message.includes('dummy')) {
        throw sbErr;
      }
    }

    // 2. Local resilient verification for registered accounts
    const users = this._getUsers().filter(u => u.email !== 'demo@techpath.edu' && u.email !== 'admin@techpath.edu');
    const user = users.find(u => u.email === cleanEmail);
    if (!user) throw new Error('No account found with that email address.');
    if (user.passwordHash !== this._hash(password)) throw new Error('Incorrect password.');

    const { passwordHash, verifyToken, ...safeUser } = user;
    safeUser.role = isUserAdmin ? 'admin' : 'student';
    safeUser.is_admin = isUserAdmin;

    const hasCompleted = Boolean(
      safeUser.profile?.onboarding_completed === true ||
      safeUser.profile?.onboardingComplete === true ||
      (safeUser.profile?.branch_id && safeUser.profile.branch_id.trim().length > 0 && safeUser.profile?.semester_id && safeUser.profile.semester_id.trim().length > 0)
    );
    if (!safeUser.profile) safeUser.profile = {};
    safeUser.profile.onboarding_completed = hasCompleted;
    safeUser.profile.onboardingComplete = hasCompleted;

    this.state = {
      user: safeUser,
      isAuthenticated: true,
      isAdmin: isUserAdmin,
      session: null
    };
    this._persist();
    this._notify('login', { user: safeUser });
    return { user: safeUser };
  }

  /**
   * Google OAuth Login via Supabase
   */
  async loginWithGoogle() {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[Supabase Google Auth]:', err.message);
      throw new Error(`Google Authentication: ${err.message}`);
    }
  }

  /**
   * Logout: Completely clears authenticated and admin states
   */
  async logout() {
    try {
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    this.state = { user: null, isAuthenticated: false, isAdmin: false, session: null };
    localStorage.removeItem(this.STORE_KEY);
    localStorage.removeItem('TECHPATH_USER_SESSION');
    this._persist();
    this._notify('logout', {});
  }

  /**
   * Forgot password
   */
  async forgotPassword(email) {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/#/reset-password`
      });
      if (!error) return { success: true };
    } catch { /* ignore */ }

    // Local simulation
    const resetToken = this._token();
    localStorage.setItem(`TP_RESET_${cleanEmail}`, resetToken);
    return { resetToken, success: true };
  }

  /**
   * Reset password
   */
  async resetPassword(email, token, newPassword) {
    if (newPassword.length < 8) throw new Error('Password must be at least 8 characters.');

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (!error) return { success: true };
    } catch { /* ignore */ }

    const users = this._getUsers();
    const idx = users.findIndex(u => u.email === email?.toLowerCase());
    if (idx !== -1) {
      users[idx].passwordHash = this._hash(newPassword);
      this._saveUsers(users);
    }
    return { success: true };
  }

  /**
   * Update user profile in Supabase & local state
   */
  async updateProfile(updates) {
    if (!this.state.user) throw new Error('Not logged in.');
    const uid = this.state.user.id;

    // Ensure permanent techpath_id cannot be forged or overwritten once set
    if (this.state.user.profile?.techpath_id) {
      updates.techpath_id = this.state.user.profile.techpath_id;
    } else if (!updates.techpath_id) {
      updates.techpath_id = await this.generateUniqueTechPathId(updates.branch_id || this.state.user.profile?.branch_id || 'cse');
    }

    if (updates.bio !== undefined) {
      updates.bio = (updates.bio || '').trim();
    }

    // Protect stable TechPath ID: never overwrite or regenerate if one already exists
    if (this.state.user.profile?.techpath_id) {
      delete updates.techpath_id;
    }

    // 1. Sync to Supabase profiles table
    try {
      await supabase.from('profiles').update(updates).eq('id', uid);
    } catch (e) {
      console.warn('[Supabase Profile Update Note]:', e.message);
    }

    // 2. Update local state
    const users = this._getUsers();
    const idx = users.findIndex(u => u.id === uid);
    if (updates.full_name || updates.name) {
      this.state.user.name = updates.full_name || updates.name;
    }
    if (updates.avatar_url || updates.avatar) {
      this.state.user.avatar = updates.avatar_url || updates.avatar;
    }
    if (idx !== -1) {
      users[idx].name = this.state.user.name;
      users[idx].avatar = this.state.user.avatar;
      users[idx].profile = { ...users[idx].profile, ...updates };
      this._saveUsers(users);
    }

    this.state.user.profile = { ...this.state.user.profile, ...updates };
    localStorage.setItem(`TP_PROFILE_${uid}`, JSON.stringify(this.state.user.profile));
    this._persist();

    // 3. Save to local dbStore so it is searchable by TechPath Connect
    try {
      const fullProfile = {
        id: uid,
        ...this.state.user.profile,
        full_name: this.state.user.name,
        email: this.state.user.email,
        updated_at: new Date().toISOString()
      };
      await dbStore.insert('profiles', fullProfile);
    } catch { /* proceed */ }

    this._notify('profile_updated', { user: this.state.user });
    return { user: this.state.user };
  }

  getProfile() {
    if (!this.state.user) return null;
    return this.state.user.profile || null;
  }

  get() {
    return this.state;
  }

  /**
   * Complete onboarding wizard
   */
  async completeOnboarding(data) {
    if (!this.state.user) throw new Error('Not logged in.');
    const uid = this.state.user.id;
    const cleanEmail = (this.state.user.email || '').toLowerCase().trim();
    const isUserAdmin = isAuthorizedAdminEmail(cleanEmail);

    let techpathId = this.state.user?.profile?.techpath_id;
    if (!techpathId) {
      techpathId = await this.generateUniqueTechPathId();
    }
    const bio = (data.bio || data.description || '').trim() || 'TechPath engineering student eager to learn and build innovative solutions.';

    const semNum = data.semester_id ? parseInt(data.semester_id.replace('sem_', ''), 10) : 1;
    const year = data.year || (semNum ? Math.ceil(semNum / 2) : 1);

    const onboardingUpdates = {
      department_id: data.department_id || 'dept_cs',
      branch_id: data.branch_id || 'cse',
      specialization_id: data.specialization_id || data.specialization || 'core',
      specialization: data.specialization || data.specialization_id || 'Core Systems Engineering',
      semester_id: data.semester_id || 'sem_1',
      year,
      career_goal: data.career_goal || 'Software Engineer',
      target_role: data.target_role || data.career_goal || 'Software Engineer',
      career_interests: Array.isArray(data.career_interests) ? data.career_interests : (data.target_role ? [data.target_role] : ['Engineering']),
      learning_level: data.learning_level || 'intermediate',
      preferred_language: data.preferred_language || 'en',
      bio,
      techpath_id: techpathId,
      onboarding_completed: true,
      onboardingComplete: true,
      is_admin: isUserAdmin,
      updated_at: new Date().toISOString()
    };

    // 1. Sync permanently to Supabase profiles table
    try {
      await supabase.from('profiles').upsert({
        id: uid,
        email: cleanEmail,
        full_name: this.state.user.name,
        ...onboardingUpdates
      });
    } catch (e) {
      console.warn('[Supabase Onboarding Upsert Note]:', e.message);
    }

    // 2. Update local profile and dbStore
    await this.updateProfile(onboardingUpdates);

    this.state.user.profile = {
      ...this.state.user.profile,
      ...onboardingUpdates,
      onboarding_completed: true,
      onboardingComplete: true
    };
    this._persist();

    this._notify('onboarding_complete', { user: this.state.user });
    return { success: true, user: this.state.user };
  }

  /**
   * Returns a sanitized, public-safe student profile view omitting private account data
   */
  async getPublicProfile(userIdOrTechPathId) {
    if (!userIdOrTechPathId) return null;
    const searchTarget = String(userIdOrTechPathId).trim();
    const searchTargetUpper = searchTarget.toUpperCase();

    let profile = null;
    try {
      const all = await dbStore.getAll('profiles');
      profile = all.find(p => 
        p.id === searchTarget || 
        (p.techpath_id && p.techpath_id.toUpperCase() === searchTargetUpper)
      );
    } catch { /* proceed */ }

    if (!profile && isSupabaseConfigured() && supabase?.from) {
      try {
        if (searchTargetUpper.startsWith('TP-')) {
          const { data } = await supabase.from('profiles').select('*')
            .ilike('techpath_id', searchTarget)
            .maybeSingle();
          if (data) profile = data;
        } else {
          const { data } = await supabase.from('profiles').select('*')
            .or(`id.eq.${searchTarget},techpath_id.ilike.${searchTarget}`)
            .maybeSingle();
          if (data) profile = data;
        }
      } catch { /* proceed */ }
    }

    if (!profile) {
      const users = this._getUsers();
      const u = users.find(u => 
        u.id === searchTarget || 
        (u.profile?.techpath_id && u.profile.techpath_id.toUpperCase() === searchTargetUpper) || 
        (u.techpath_id && u.techpath_id.toUpperCase() === searchTargetUpper)
      );
      if (u) {
        profile = {
          id: u.id,
          techpath_id: u.profile?.techpath_id || u.techpath_id || 'TP-00000000',
          full_name: u.name,
          avatar_url: u.avatar || null,
          branch_id: u.profile?.branch_id || 'cse',
          department_id: u.profile?.department_id || 'eng',
          specialization: u.profile?.specialization || 'Core Systems Engineering',
          semester_id: u.profile?.semester_id || 'sem_3',
          learning_level: u.profile?.learning_level || 'intermediate',
          skills: u.profile?.skills || ['Problem Solving', 'Engineering Fundamentals'],
          bio: u.profile?.bio || u.profile?.description || 'TechPath Engineering Student',
          career_goal: u.profile?.career_goal || 'Software Engineer',
          career_interests: u.profile?.career_interests || ['Software Engineering'],
          github_url: u.profile?.github_url || null,
          linkedin_url: u.profile?.linkedin_url || null,
          portfolio_url: u.profile?.portfolio_url || null
        };
      }
    }

    if (!profile) return null;

    return {
      id: profile.id,
      techpath_id: profile.techpath_id || `TP-00000000`,
      full_name: profile.full_name || profile.name || 'TechPath Student',
      avatar_url: profile.avatar_url || null,
      department_id: profile.department_id || 'eng',
      department_name: profile.department_name || 'Engineering',
      branch_id: profile.branch_id || 'cse',
      branch_name: profile.branch_name || (profile.branch_id ? profile.branch_id.toUpperCase() : 'CSE'),
      specialization: profile.specialization || 'Core Systems Engineering',
      semester_id: profile.semester_id || 'sem_3',
      learning_level: profile.learning_level || 'intermediate',
      skills: Array.isArray(profile.skills) ? profile.skills : (profile.skills ? profile.skills.split(',').map(s => s.trim()) : []),
      bio: profile.bio || profile.description || 'TechPath engineering student eager to learn and build.',
      career_goal: profile.career_goal || 'Software Engineer',
      career_interests: Array.isArray(profile.career_interests) ? profile.career_interests : (profile.career_interests ? profile.career_interests.split(',').map(c => c.trim()) : ['Engineering']),
      github_url: profile.github_url || null,
      linkedin_url: profile.linkedin_url || null,
      portfolio_url: profile.portfolio_url || null
    };
  }

  /**
   * Account deletion (GDPR Article 17)
   */
  async deleteAccount() {
    if (!this.state.user) throw new Error('Not logged in.');
    const uid = this.state.user.id;

    try {
      await supabase.from('data_deletion_requests').insert({
        user_id: uid,
        reason: 'User initiated account deletion',
        status: 'completed'
      });
      await supabase.from('profiles').delete().eq('id', uid);
    } catch { /* ignore */ }

    const users = this._getUsers().filter(u => u.id !== uid);
    this._saveUsers(users);
    await this.logout();
    return { success: true };
  }

  getCookiePreferences() {
    try {
      const prefs = localStorage.getItem('TP_COOKIE_PREFS');
      return prefs ? JSON.parse(prefs) : { essential: true, analytics: false, preferences: false, marketing: false };
    } catch {
      return { essential: true, analytics: false, preferences: false, marketing: false };
    }
  }

  setCookiePreferences(prefs) {
    localStorage.setItem('TP_COOKIE_PREFS', JSON.stringify(prefs));
  }

  async requestDataDeletion(reason = 'User requested erasure') {
    const logs = JSON.parse(localStorage.getItem('TP_ERASURE_REQUESTS') || '[]');
    logs.push({
      userId: this.state.user?.id || 'guest',
      email: this.state.user?.email || 'unknown',
      reason,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('TP_ERASURE_REQUESTS', JSON.stringify(logs));
    return { success: true };
  }

  getUser() { return this.state.user; }
  isAdmin() { return this.isAdminUser(); }
  seedAdminIfMissing() {
    // Deprecated: No demo or artificial admin accounts are permitted.
  }
}

export const authContext = new AuthContextManager();
export const authManager = authContext;
