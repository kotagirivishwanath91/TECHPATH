/**
 * TECHPATH — STUDY GROUP ENGINE
 * Academic peer collaboration, personalized engineering study circles,
 * public/private group lifecycle, membership management, and member-gated group discussions.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { dbStore } from '../db/store.js';
import { NotificationEngine } from './NotificationEngine.js';

const SEED_STUDY_GROUPS = [
  {
    id: 'grp_cse_os_kernel',
    name: 'Linux Kernel & Systems Architecture',
    description: 'Deep dive into virtual memory management, COW page faults, process scheduling, and systems programming in C.',
    branch: 'CSE',
    semester: 4,
    subject: 'Operating Systems',
    difficulty: 'Advanced',
    is_private: false,
    max_members: 25,
    creator_id: 'usr_faculty_systems',
    creator_name: 'Dr. Ramesh (Faculty Mentor)',
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'grp_gate_core_circle',
    name: 'GATE 2026 Comprehensive Engineering Drill',
    description: 'Daily previous-year questions (PYQ), timed mock tests, formula revisions, and rank improvement tactics.',
    branch: 'ALL',
    semester: 6,
    subject: 'GATE Prep',
    difficulty: 'Comprehensive',
    is_private: false,
    max_members: 50,
    creator_id: 'usr_gate_lead',
    creator_name: 'Priya Patel (GATE Aspirant)',
    created_at: '2026-01-15T12:00:00Z',
    updated_at: '2026-01-15T12:00:00Z'
  },
  {
    id: 'grp_ece_vlSI_riscv',
    name: 'RISC-V Microarchitecture & VLSI RTL',
    description: 'Hardware description language (Verilog/SystemVerilog), RTL synthesis, timing closure, and FPGA implementation.',
    branch: 'ECE',
    semester: 5,
    subject: 'VLSI Design',
    difficulty: 'Advanced',
    is_private: true,
    max_members: 15,
    creator_id: 'usr_ece_mentor',
    creator_name: 'Kunal Verma (Silicon Designer)',
    created_at: '2026-02-01T09:00:00Z',
    updated_at: '2026-02-01T09:00:00Z'
  },
  {
    id: 'grp_cse_dsa_faang',
    name: 'Algorithms & Competitive Programming (LeetCode 75)',
    description: 'Dynamic programming, graph theory, monotonic queues, and tier-1 company technical interview preparation.',
    branch: 'CSE',
    semester: 3,
    subject: 'Data Structures & Algorithms',
    difficulty: 'Intermediate',
    is_private: false,
    max_members: 30,
    creator_id: 'usr_peer_lead',
    creator_name: 'Aarav Sharma (Student Engineer)',
    created_at: '2026-02-05T14:30:00Z',
    updated_at: '2026-02-05T14:30:00Z'
  },
  {
    id: 'grp_aiml_foundations',
    name: 'Deep Learning & Neural Networks Lab',
    description: 'Backpropagation from scratch, PyTorch tensor architectures, transformer attention mechanisms, and model evaluation.',
    branch: 'AIML',
    semester: 5,
    subject: 'Machine Learning',
    difficulty: 'Intermediate',
    is_private: false,
    max_members: 20,
    creator_id: 'usr_ai_researcher',
    creator_name: 'Ananya Roy (ML Engineer)',
    created_at: '2026-02-12T16:00:00Z',
    updated_at: '2026-02-12T16:00:00Z'
  },
  {
    id: 'grp_mech_fea_cfd',
    name: 'FEA & Computational Fluid Dynamics Study Group',
    description: 'Finite element analysis, Navier-Stokes solvers, ANSYS simulation modeling, and thermodynamic optimization.',
    branch: 'MECH',
    semester: 6,
    subject: 'Thermodynamics & Fluid Mechanics',
    difficulty: 'Advanced',
    is_private: true,
    max_members: 12,
    creator_id: 'usr_mech_lead',
    creator_name: 'Vikram Joshi (Core Mech)',
    created_at: '2026-02-20T11:00:00Z',
    updated_at: '2026-02-20T11:00:00Z'
  }
];

export class StudyGroupEngine {
  static _initialized = false;

  /**
   * Ensure initial default groups exist in store
   */
  static async init() {
    if (this._initialized) return;
    try {
      // 1. Check IDB store
      const localGroups = await dbStore.getAll('study_groups').catch(() => []);
      if (!localGroups || localGroups.length === 0) {
        for (const g of SEED_STUDY_GROUPS) {
          await dbStore.put('study_groups', g).catch(() => {});
          // Add default seed membership
          await dbStore.put('study_group_members', {
            id: `mem_${g.id}_${g.creator_id}`,
            group_id: g.id,
            user_id: g.creator_id,
            user_name: g.creator_name || 'Group Creator',
            role: 'creator',
            joined_at: g.created_at
          }).catch(() => {});
        }
      }

      // 2. Sync with Supabase if available
      if (supabase) {
        const { data: remoteGroups } = await supabase.from('study_groups').select('id').limit(1);
        if (!remoteGroups || remoteGroups.length === 0) {
          const insertPayload = SEED_STUDY_GROUPS.map(g => ({
            id: g.id,
            name: g.name,
            description: g.description,
            branch: g.branch,
            semester: g.semester,
            subject: g.subject,
            difficulty: g.difficulty,
            is_private: g.is_private,
            max_members: g.max_members,
            creator_id: g.creator_id,
            created_at: g.created_at,
            updated_at: g.updated_at
          }));
          await supabase.from('study_groups').insert(insertPayload).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('[StudyGroupEngine.init] Warning during initialization:', err);
    } finally {
      this._initialized = true;
    }
  }

  /**
   * Retrieve all groups with membership metadata
   */
  static async getAllGroups() {
    await this.init();
    let groups = [];
    if (supabase) {
      try {
        const { data, error } = await supabase.from('study_groups').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) groups = data;
      } catch (e) {}
    }
    if (groups.length === 0) {
      groups = await dbStore.getAll('study_groups').catch(() => []);
    }
    return groups;
  }

  /**
   * Get personalized groups for a specific user and academic profile
   * Tab support: 'recommended' | 'my_groups' | 'discover'
   */
  static async getPersonalizedGroups(profile = {}, filters = {}, currentUserId = null) {
    await this.init();
    const allGroups = await this.getAllGroups();
    
    // Fetch user memberships and pending requests
    const memberships = await this.getUserMemberships(currentUserId);
    const memberGroupIds = new Set(memberships.map(m => m.group_id));
    const pendingRequestGroupIds = new Set(await this.getUserPendingRequests(currentUserId));

    // Fetch members count for each group
    const memberCounts = await this.getAllGroupMemberCounts();

    const enriched = allGroups.map(g => {
      const count = memberCounts[g.id] || 1;
      const isMember = currentUserId ? memberGroupIds.has(g.id) : false;
      const isCreator = currentUserId ? (g.creator_id === currentUserId) : false;
      const hasPendingRequest = currentUserId ? pendingRequestGroupIds.has(g.id) : false;
      const isFull = count >= (g.max_members || 50);

      // Compute personalized match score based on user profile
      let score = 0;
      const userBranch = (profile.branch || '').toUpperCase();
      const groupBranch = (g.branch || '').toUpperCase();
      if (groupBranch === 'ALL' || (userBranch && groupBranch.includes(userBranch))) {
        score += 35;
      }
      if (profile.semester && Number(g.semester) === Number(profile.semester)) {
        score += 25;
      }
      if (profile.specialization && g.subject && 
          (g.subject.toLowerCase().includes(profile.specialization.toLowerCase()) || 
           g.description.toLowerCase().includes(profile.specialization.toLowerCase()))) {
        score += 20;
      }
      if (profile.career_goal && (
          g.name.toLowerCase().includes(profile.career_goal.toLowerCase()) ||
          g.description.toLowerCase().includes(profile.career_goal.toLowerCase()))) {
        score += 20;
      }

      return {
        ...g,
        member_count: count,
        is_member: isMember,
        is_creator: isCreator,
        has_pending_request: hasPendingRequest,
        is_full: isFull,
        relevance_score: score
      };
    });

    // Apply Filters
    let result = enriched;

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(g => 
        g.name.toLowerCase().includes(q) || 
        g.description.toLowerCase().includes(q) ||
        (g.subject && g.subject.toLowerCase().includes(q))
      );
    }
    if (filters.branch && filters.branch !== 'ALL') {
      result = result.filter(g => g.branch === 'ALL' || g.branch === filters.branch);
    }
    if (filters.semester && filters.semester !== 'ALL') {
      result = result.filter(g => Number(g.semester) === Number(filters.semester));
    }
    if (filters.difficulty && filters.difficulty !== 'ALL') {
      result = result.filter(g => g.difficulty === filters.difficulty);
    }
    if (filters.visibility && filters.visibility !== 'ALL') {
      const reqPrivate = filters.visibility === 'PRIVATE';
      result = result.filter(g => !!g.is_private === reqPrivate);
    }

    // Apply Tab Views
    const tab = filters.tab || 'recommended';
    if (tab === 'my_groups') {
      result = result.filter(g => g.is_member);
    } else if (tab === 'recommended') {
      // Sort by relevance score descending
      result = result.sort((a, b) => b.relevance_score - a.relevance_score);
    } else {
      // 'discover' - sort by newest
      result = result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return result;
  }

  /**
   * Get all active memberships for a user
   */
  static async getUserMemberships(userId) {
    if (!userId) return [];
    let list = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('study_group_members')
          .select('*')
          .eq('user_id', userId);
        if (!error && data) list = data;
      } catch (e) {}
    }
    if (list.length === 0) {
      const all = await dbStore.getAll('study_group_members').catch(() => []);
      list = all.filter(m => m.user_id === userId);
    }
    return list;
  }

  /**
   * Get pending join requests for a user
   */
  static async getUserPendingRequests(userId) {
    if (!userId) return [];
    let list = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('study_group_join_requests')
          .select('group_id')
          .eq('user_id', userId)
          .eq('status', 'pending');
        if (!error && data) list = data.map(r => r.group_id);
      } catch (e) {}
    }
    if (list.length === 0) {
      const all = await dbStore.getAll('study_group_join_requests').catch(() => []);
      list = all.filter(r => r.user_id === userId && r.status === 'pending').map(r => r.group_id);
    }
    return list;
  }

  /**
   * Get member counts mapped by group_id
   */
  static async getAllGroupMemberCounts() {
    const counts = {};
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('study_group_members')
          .select('group_id');
        if (!error && data) {
          data.forEach(row => {
            counts[row.group_id] = (counts[row.group_id] || 0) + 1;
          });
          return counts;
        }
      } catch (e) {}
    }
    const all = await dbStore.getAll('study_group_members').catch(() => []);
    all.forEach(row => {
      counts[row.group_id] = (counts[row.group_id] || 0) + 1;
    });
    return counts;
  }

  /**
   * Retrieve group details including full member list and pending requests (if creator)
   */
  static async getGroupDetails(groupId, currentUserId = null) {
    await this.init();
    let group = null;
    if (supabase) {
      try {
        const { data, error } = await supabase.from('study_groups').select('*').eq('id', groupId).single();
        if (!error && data) group = data;
      } catch (e) {}
    }
    if (!group) {
      group = await dbStore.get('study_groups', groupId).catch(() => null);
    }
    if (!group) return null;

    // Fetch members
    let members = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('study_group_members')
          .select('*')
          .eq('group_id', groupId);
        if (!error && data) members = data;
      } catch (e) {}
    }
    if (members.length === 0) {
      const allM = await dbStore.getAll('study_group_members').catch(() => []);
      members = allM.filter(m => m.group_id === groupId);
    }

    // Hydrate member profile details
    const hydratedMembers = await Promise.all(members.map(async m => {
      if (m.user_name && m.techpath_id) return m;
      let prof = null;
      if (supabase) {
        const { data } = await supabase.from('profiles').select('full_name, techpath_id, avatar_url, branch').eq('id', m.user_id).single().catch(() => ({}));
        prof = data;
      }
      if (!prof) {
        prof = await dbStore.get('users', m.user_id).catch(() => null);
      }
      return {
        ...m,
        user_name: prof?.full_name || m.user_name || 'Engineering Peer',
        techpath_id: prof?.techpath_id || 'TP-UNKNOWN',
        avatar_url: prof?.avatar_url || null,
        branch: prof?.branch || 'ENGINEERING'
      };
    }));

    // Fetch pending requests if current user is group creator
    let pendingRequests = [];
    const isCreator = currentUserId && (group.creator_id === currentUserId);
    if (isCreator) {
      if (supabase) {
        try {
          const { data } = await supabase
            .from('study_group_join_requests')
            .select('*')
            .eq('group_id', groupId)
            .eq('status', 'pending');
          if (data) pendingRequests = data;
        } catch (e) {}
      }
      if (pendingRequests.length === 0) {
        const allReqs = await dbStore.getAll('study_group_join_requests').catch(() => []);
        pendingRequests = allReqs.filter(r => r.group_id === groupId && r.status === 'pending');
      }
    }

    const isMember = currentUserId ? members.some(m => m.user_id === currentUserId) : false;

    return {
      ...group,
      members: hydratedMembers,
      member_count: members.length,
      is_member: isMember,
      is_creator: isCreator,
      pending_requests: pendingRequests
    };
  }

  /**
   * Create a new Study Group
   */
  static async createGroup(groupData, creatorUser) {
    if (!creatorUser || !creatorUser.id) {
      throw new Error('Authentication required to create a study group.');
    }
    const name = (groupData.name || '').trim();
    if (name.length < 3) throw new Error('Study group name must be at least 3 characters.');

    const newId = 'grp_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();

    const record = {
      id: newId,
      name,
      description: (groupData.description || '').trim(),
      branch: groupData.branch || 'ALL',
      semester: Number(groupData.semester) || 1,
      subject: (groupData.subject || '').trim(),
      difficulty: groupData.difficulty || 'Intermediate',
      is_private: Boolean(groupData.is_private),
      max_members: Number(groupData.max_members) || 25,
      creator_id: creatorUser.id,
      creator_name: creatorUser.full_name || creatorUser.email || 'Group Creator',
      created_at: now,
      updated_at: now
    };

    // 1. Write group to Supabase
    if (supabase) {
      try {
        await supabase.from('study_groups').insert([record]);
      } catch (err) {
        console.warn('[StudyGroupEngine.createGroup] Remote insert warning:', err);
      }
    }
    // Store in IDB
    await dbStore.put('study_groups', record);

    // 2. Add creator as first member with 'creator' role
    const memberRecord = {
      id: `mem_${newId}_${creatorUser.id}`,
      group_id: newId,
      user_id: creatorUser.id,
      user_name: creatorUser.full_name || 'Group Creator',
      role: 'creator',
      joined_at: now
    };

    if (supabase) {
      try {
        await supabase.from('study_group_members').insert([memberRecord]);
      } catch (e) {}
    }
    await dbStore.put('study_group_members', memberRecord);

    window.dispatchEvent(new CustomEvent('techpath:study_group_created', { detail: record }));
    return record;
  }

  /**
   * Join a Study Group (immediate for public, request for private)
   */
  static async joinGroup(groupId, user) {
    if (!user || !user.id) throw new Error('You must be signed in to join a study group.');

    const details = await this.getGroupDetails(groupId, user.id);
    if (!details) throw new Error('Study group not found.');

    if (details.is_member) {
      return { success: true, status: 'already_member', message: 'You are already a member of this group.' };
    }
    if (details.member_count >= details.max_members) {
      throw new Error('This study group has reached its maximum member capacity.');
    }

    const now = new Date().toISOString();

    // 1. Public group -> Direct Join
    if (!details.is_private) {
      const memberRecord = {
        id: `mem_${groupId}_${user.id}`,
        group_id: groupId,
        user_id: user.id,
        user_name: user.full_name || user.email || 'Member',
        role: 'member',
        joined_at: now
      };

      if (supabase) {
        try {
          await supabase.from('study_group_members').insert([memberRecord]);
        } catch (e) {}
      }
      await dbStore.put('study_group_members', memberRecord);

      // Notify group creator
      if (details.creator_id && details.creator_id !== user.id) {
        await NotificationEngine.createNotification({
          recipientId: details.creator_id,
          actorId: user.id,
          actorName: user.full_name || 'A student',
          actorAvatar: user.avatar_url,
          type: 'STUDY_GROUP_JOINED',
          title: 'New Study Group Member',
          message: `${user.full_name || 'A student'} joined "${details.name}"`,
          relatedEntityId: groupId,
          relatedEntityType: 'study_group'
        });
      }

      window.dispatchEvent(new CustomEvent('techpath:study_group_membership_changed', { detail: { groupId, action: 'joined' } }));
      return { success: true, status: 'joined', message: `Welcome! You have joined "${details.name}".` };
    }

    // 2. Private group -> Send Join Request
    const requestId = `req_${groupId}_${user.id}`;
    const reqRecord = {
      id: requestId,
      group_id: groupId,
      user_id: user.id,
      user_name: user.full_name || 'Engineering Student',
      user_avatar: user.avatar_url || null,
      status: 'pending',
      created_at: now,
      updated_at: now
    };

    if (supabase) {
      try {
        await supabase.from('study_group_join_requests').upsert([reqRecord]);
      } catch (e) {}
    }
    await dbStore.put('study_group_join_requests', reqRecord);

    // Notify group creator
    if (details.creator_id) {
      await NotificationEngine.createNotification({
        recipientId: details.creator_id,
        actorId: user.id,
        actorName: user.full_name || 'A student',
        actorAvatar: user.avatar_url,
        type: 'STUDY_GROUP_REQUEST',
        title: 'Study Group Join Request',
        message: `${user.full_name || 'A student'} requested to join your private group "${details.name}"`,
        relatedEntityId: groupId,
        relatedEntityType: 'study_group'
      });
    }

    window.dispatchEvent(new CustomEvent('techpath:study_group_membership_changed', { detail: { groupId, action: 'requested' } }));
    return { success: true, status: 'requested', message: `Join request sent to the organizer of "${details.name}".` };
  }

  /**
   * Leave a study group
   */
  static async leaveGroup(groupId, userId) {
    if (!userId) throw new Error('User ID required.');
    const details = await this.getGroupDetails(groupId, userId);
    if (!details) throw new Error('Study group not found.');

    // Remove from membership table
    if (supabase) {
      try {
        await supabase.from('study_group_members').delete().eq('group_id', groupId).eq('user_id', userId);
      } catch (e) {}
    }
    const memKey = `mem_${groupId}_${userId}`;
    await dbStore.delete('study_group_members', memKey).catch(() => {});

    // If user was creator:
    if (details.creator_id === userId) {
      const remainingMembers = details.members.filter(m => m.user_id !== userId);
      if (remainingMembers.length > 0) {
        // Transfer creator role to next member
        const newCreator = remainingMembers[0];
        if (supabase) {
          await supabase.from('study_groups').update({ creator_id: newCreator.user_id, creator_name: newCreator.user_name }).eq('id', groupId).catch(() => {});
          await supabase.from('study_group_members').update({ role: 'creator' }).eq('id', newCreator.id).catch(() => {});
        }
        await dbStore.put('study_groups', { ...details, creator_id: newCreator.user_id, creator_name: newCreator.user_name });
      } else {
        // No members left -> Archive or remove group
        if (supabase) {
          await supabase.from('study_groups').delete().eq('id', groupId).catch(() => {});
        }
        await dbStore.delete('study_groups', groupId).catch(() => {});
      }
    }

    window.dispatchEvent(new CustomEvent('techpath:study_group_membership_changed', { detail: { groupId, action: 'left' } }));
    return { success: true, message: 'You have left the study group.' };
  }

  /**
   * Accept or Reject a join request (Creator only)
   */
  static async handleJoinRequest(requestId, decision, creatorUser) {
    if (!creatorUser || !creatorUser.id) throw new Error('Unauthorized');
    
    // Find request
    let req = null;
    if (supabase) {
      const { data } = await supabase.from('study_group_join_requests').select('*').eq('id', requestId).single();
      if (data) req = data;
    }
    if (!req) {
      req = await dbStore.get('study_group_join_requests', requestId).catch(() => null);
    }
    if (!req) throw new Error('Join request not found.');

    const group = await this.getGroupDetails(req.group_id, creatorUser.id);
    if (!group || group.creator_id !== creatorUser.id) {
      throw new Error('Only the group organizer can approve join requests.');
    }

    const now = new Date().toISOString();
    const newStatus = decision === 'accept' ? 'accepted' : 'rejected';

    // Update request
    if (supabase) {
      await supabase.from('study_group_join_requests').update({ status: newStatus, updated_at: now }).eq('id', requestId).catch(() => {});
    }
    await dbStore.put('study_group_join_requests', { ...req, status: newStatus, updated_at: now });

    if (decision === 'accept') {
      // Add as member
      const memberRecord = {
        id: `mem_${req.group_id}_${req.user_id}`,
        group_id: req.group_id,
        user_id: req.user_id,
        user_name: req.user_name || 'Engineering Student',
        role: 'member',
        joined_at: now
      };
      if (supabase) {
        await supabase.from('study_group_members').insert([memberRecord]).catch(() => {});
      }
      await dbStore.put('study_group_members', memberRecord);

      // Notify applicant
      await NotificationEngine.createNotification({
        recipientId: req.user_id,
        actorId: creatorUser.id,
        actorName: creatorUser.full_name || 'Group Organizer',
        type: 'STUDY_GROUP_ACCEPTED',
        title: 'Study Group Request Approved! 🎉',
        message: `Your request to join "${group.name}" was accepted. You can now access discussions.`,
        relatedEntityId: req.group_id,
        relatedEntityType: 'study_group'
      });
    }

    window.dispatchEvent(new CustomEvent('techpath:study_group_membership_changed', { detail: { groupId: req.group_id } }));
    return { success: true, status: newStatus };
  }

  /**
   * Retrieve group discussion messages (STRICT GATING: active members only)
   */
  static async getGroupMessages(groupId, userId) {
    if (!userId) throw new Error('Authentication required.');

    // 1. Verify membership
    const memberships = await this.getUserMemberships(userId);
    const isMember = memberships.some(m => m.group_id === groupId);
    if (!isMember) {
      throw new Error('Access denied: You must be an accepted member of this study group to view discussions.');
    }

    let messages = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('study_group_messages')
          .select('*')
          .eq('group_id', groupId)
          .order('created_at', { ascending: true });
        if (!error && data) messages = data;
      } catch (e) {}
    }
    if (messages.length === 0) {
      const allMsgs = await dbStore.getAll('study_group_messages').catch(() => []);
      messages = allMsgs.filter(m => m.group_id === groupId).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    return messages;
  }

  /**
   * Post a discussion message in study group (STRICT GATING: active members only)
   */
  static async sendGroupMessage(groupId, user, text) {
    if (!user || !user.id) throw new Error('Authentication required.');
    const content = (text || '').trim();
    if (!content) throw new Error('Message cannot be empty.');

    // 1. Verify membership
    const memberships = await this.getUserMemberships(user.id);
    const isMember = memberships.some(m => m.group_id === groupId);
    if (!isMember) {
      throw new Error('Access denied: Only group members can post messages in this discussion circle.');
    }

    const msgId = 'sgm_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();

    const record = {
      id: msgId,
      group_id: groupId,
      user_id: user.id,
      user_name: user.full_name || user.email || 'Study Member',
      user_avatar: user.avatar_url || null,
      message: content,
      created_at: now
    };

    if (supabase) {
      try {
        await supabase.from('study_group_messages').insert([record]);
      } catch (e) {}
    }
    await dbStore.put('study_group_messages', record);

    window.dispatchEvent(new CustomEvent('techpath:study_group_message_posted', { detail: record }));
    return record;
  }
}
