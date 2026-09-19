/**
 * TECHPATH — NOTIFICATION ENGINE
 * Dual Supabase & IndexedDB in-app notification creation, delivery, and persistence
 */
import { dbStore } from '../db/store.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export class NotificationEngine {
  static _userId() {
    try {
      const auth = JSON.parse(localStorage.getItem('TP_AUTH_STATE') || '{}');
      return auth?.user?.id || 'usr_guest';
    } catch {
      return 'usr_guest';
    }
  }

  /**
   * Send a notification with optional action payload
   */
  static async send(type, title, message, link = null, targetUserId = null, { relatedUserId = null, relatedEntityId = null } = {}) {
    const uid = targetUserId || this._userId();
    const notifId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const notif = {
      id: notifId,
      user_id: uid,
      type,      // 'social' | 'study_group' | 'achievement' | 'reminder' | 'skill' | 'quiz' | 'system'
      title,
      message,
      link: link || null,
      related_user_id: relatedUserId || null,
      related_entity_id: relatedEntityId || null,
      read: false,
      created_at: new Date().toISOString()
    };

    // 1. Persist to local IndexedDB
    try {
      await dbStore.insert('notifications', notif);
    } catch { /* proceed */ }

    // 2. Persist to Supabase if connected
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        await supabase.from('notifications').insert({
          id: notif.id,
          user_id: notif.user_id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          link: notif.link,
          related_user_id: notif.related_user_id,
          related_entity_id: notif.related_entity_id,
          read: notif.read,
          created_at: notif.created_at
        });
      } catch (err) {
        console.warn('Supabase notification dispatch note:', err.message);
      }
    }

    this._updateBadge();
    return notif;
  }

  /**
   * Get all notifications for the current user (Supabase + Local IndexedDB merged)
   */
  static async getAll(targetUserId = null) {
    const uid = targetUserId || this._userId();
    let notifs = [];

    // Local IDB
    try {
      notifs = await dbStore.filter('notifications', n => n.user_id === uid);
    } catch { /* proceed */ }

    // Supabase
    if (isSupabaseConfigured() && supabase?.from && uid && uid !== 'usr_guest') {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          const map = new Map();
          notifs.forEach(n => map.set(n.id, n));
          data.forEach(n => {
            map.set(n.id, { ...map.get(n.id), ...n });
            // Cache in IDB
            dbStore.insert('notifications', n).catch(() => {});
          });
          notifs = Array.from(map.values());
        }
      } catch (e) {
        console.warn('Supabase notifications sync note:', e.message);
      }
    }

    // Sort newest first
    notifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return notifs;
  }

  static async getUnread(targetUserId = null) {
    const all = await this.getAll(targetUserId);
    return all.filter(n => !n.read);
  }

  static async markRead(id) {
    if (!id) return;
    try {
      await dbStore.update('notifications', id, { read: true });
    } catch { /* proceed */ }

    if (isSupabaseConfigured() && supabase?.from) {
      try {
        await supabase.from('notifications').update({ read: true }).eq('id', id);
      } catch { /* proceed */ }
    }

    this._updateBadge();
  }

  static async markAllRead() {
    const unread = await this.getUnread();
    const ids = unread.map(n => n.id);

    await Promise.all(ids.map(id => dbStore.update('notifications', id, { read: true }).catch(() => {})));

    if (isSupabaseConfigured() && supabase?.from && ids.length > 0) {
      try {
        await supabase.from('notifications').update({ read: true }).in('id', ids);
      } catch { /* proceed */ }
    }

    this._updateBadge();
  }

  /**
   * Permanently dismiss / delete a notification
   */
  static async dismiss(id) {
    if (!id) return;
    try {
      await dbStore.delete('notifications', id);
    } catch { /* proceed */ }

    if (isSupabaseConfigured() && supabase?.from) {
      try {
        await supabase.from('notifications').delete().eq('id', id);
      } catch { /* proceed */ }
    }

    this._updateBadge();
  }

  static async getUnreadCount() {
    const unread = await this.getUnread();
    return unread.length;
  }

  static _updateBadge() {
    this.getUnreadCount().then(count => {
      const badge = document.getElementById('notif-badge');
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
    }).catch(() => {});
  }

  static async delete(id) {
    return this.dismiss(id);
  }

  /**
   * Flexible object-based notification dispatcher
   */
  static async createNotification(payload) {
    if (!payload) return null;
    const { recipientId, targetUserId, actorId, type, title, message, link, relatedEntityId } = payload;
    return this.send(
      type || 'social',
      title || 'Notification',
      message || '',
      link || null,
      recipientId || targetUserId,
      { relatedUserId: actorId, relatedEntityId }
    );
  }

  // Convenience senders
  static async achievement(title, msg) { return this.send('achievement', title, msg, '#/achievements'); }
  static async skillGap(skillName) {
    return this.send('skill', 'Skill Gap Detected', `Practice ${skillName} to close your skill gap.`, '#/skills');
  }
  static async studyReminder(subject) {
    return this.send('reminder', 'Study Reminder', `Continue studying ${subject} to maintain your streak.`, '#/learning');
  }
  static async quizReady(subject) {
    return this.send('quiz', 'Quiz Available', `A new quiz is available for ${subject}.`, '#/practice');
  }
}
