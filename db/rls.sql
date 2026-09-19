-- ===============================================================
-- TECHPATH — ROW LEVEL SECURITY (RLS) POLICIES
-- Enterprise Security & Privacy Enforcement
-- ===============================================================

-- Helper function to check if current user is the single authorized platform administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN (
        LOWER(TRIM(COALESCE(auth.jwt() ->> 'email', ''))) = 'kotagirivishwanath@gmail.com'
    );
END;
$$;

-- Enable RLS across all 55 application tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_role_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_trajectories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trajectory_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exam_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_messages ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
CREATE POLICY "Users can view profiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Only admin can delete profiles" ON profiles;
CREATE POLICY "Only admin can delete profiles" ON profiles
  FOR DELETE USING (public.is_admin());

-- 2. User Skills & Skill Gaps
DROP POLICY IF EXISTS "Users can manage own skills" ON user_skills;
CREATE POLICY "Users can manage own skills" ON user_skills
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can view own skill gaps" ON skill_gaps;
CREATE POLICY "Users can view own skill gaps" ON skill_gaps
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- 3. Resumes & Mock Interviews
DROP POLICY IF EXISTS "Users manage own resumes" ON resumes;
CREATE POLICY "Users manage own resumes" ON resumes
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users manage own interview sessions" ON interview_sessions;
CREATE POLICY "Users manage own interview sessions" ON interview_sessions
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users access own interview questions" ON interview_questions;
CREATE POLICY "Users access own interview questions" ON interview_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM interview_sessions s 
      WHERE s.id = session_id AND (s.user_id = auth.uid() OR public.is_admin())
    )
  );

-- 4. Progress, Quizzes & Flashcards
DROP POLICY IF EXISTS "Users manage own project progress" ON project_progress;
CREATE POLICY "Users manage own project progress" ON project_progress
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users access own quiz attempts" ON quiz_attempts;
CREATE POLICY "Users access own quiz attempts" ON quiz_attempts
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users access own flashcard progress" ON flashcard_progress;
CREATE POLICY "Users access own flashcard progress" ON flashcard_progress
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users access own exam attempts" ON exam_attempts;
CREATE POLICY "Users access own exam attempts" ON exam_attempts
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users manage own internships" ON user_internships;
CREATE POLICY "Users manage own internships" ON user_internships
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- 5. Consents & Privacy
DROP POLICY IF EXISTS "Users manage own consents" ON consents;
CREATE POLICY "Users manage own consents" ON consents
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Anyone insert cookie consents" ON cookie_consents;
CREATE POLICY "Anyone insert cookie consents" ON cookie_consents
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users view own cookie consents" ON cookie_consents;
CREATE POLICY "Users view own cookie consents" ON cookie_consents
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin() OR user_id IS NULL);

DROP POLICY IF EXISTS "Users submit deletion requests" ON data_deletion_requests;
CREATE POLICY "Users submit deletion requests" ON data_deletion_requests
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users manage own support tickets" ON support_tickets;
CREATE POLICY "Users manage own support tickets" ON support_tickets
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- 6. Admin Audit Logs (Strict Admin-Only Access)
DROP POLICY IF EXISTS "Only admin can access audit logs" ON admin_audit_logs;
DROP POLICY IF EXISTS "Admins only audit logs" ON admin_audit_logs;
CREATE POLICY "Admins only audit logs" ON admin_audit_logs
  FOR ALL USING (public.is_admin());

-- 7. Public Academic Catalog (Read-Only for Authenticated & Public Users, Mutations Admin-Only)
DROP POLICY IF EXISTS "Public read departments" ON departments;
CREATE POLICY "Public read departments" ON departments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate departments" ON departments;
CREATE POLICY "Admin mutate departments" ON departments FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read branches" ON branches;
CREATE POLICY "Public read branches" ON branches FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate branches" ON branches;
CREATE POLICY "Admin mutate branches" ON branches FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read specializations" ON specializations;
CREATE POLICY "Public read specializations" ON specializations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate specializations" ON specializations;
CREATE POLICY "Admin mutate specializations" ON specializations FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read semesters" ON semesters;
CREATE POLICY "Public read semesters" ON semesters FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate semesters" ON semesters;
CREATE POLICY "Admin mutate semesters" ON semesters FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read subjects" ON subjects;
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate subjects" ON subjects;
CREATE POLICY "Admin mutate subjects" ON subjects FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read topics" ON topics;
CREATE POLICY "Public read topics" ON topics FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate topics" ON topics;
CREATE POLICY "Admin mutate topics" ON topics FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read videos" ON videos;
CREATE POLICY "Public read videos" ON videos FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate videos" ON videos;
CREATE POLICY "Admin mutate videos" ON videos FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read lessons" ON lessons;
CREATE POLICY "Public read lessons" ON lessons FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate lessons" ON lessons;
CREATE POLICY "Admin mutate lessons" ON lessons FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read resources" ON resources;
CREATE POLICY "Public read resources" ON resources FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate resources" ON resources;
CREATE POLICY "Admin mutate resources" ON resources FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read branch_models" ON branch_models;
CREATE POLICY "Public read branch_models" ON branch_models FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate branch_models" ON branch_models;
CREATE POLICY "Admin mutate branch_models" ON branch_models FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read model_components" ON model_components;
CREATE POLICY "Public read model_components" ON model_components FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate model_components" ON model_components;
CREATE POLICY "Admin mutate model_components" ON model_components FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read component_explanations" ON component_explanations;
CREATE POLICY "Public read component_explanations" ON component_explanations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate component_explanations" ON component_explanations;
CREATE POLICY "Admin mutate component_explanations" ON component_explanations FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read skills" ON skills;
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate skills" ON skills;
CREATE POLICY "Admin mutate skills" ON skills FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read career_roles" ON career_roles;
CREATE POLICY "Public read career_roles" ON career_roles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate career_roles" ON career_roles;
CREATE POLICY "Admin mutate career_roles" ON career_roles FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read career_role_skills" ON career_role_skills;
CREATE POLICY "Public read career_role_skills" ON career_role_skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate career_role_skills" ON career_role_skills;
CREATE POLICY "Admin mutate career_role_skills" ON career_role_skills FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read projects" ON projects;
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate projects" ON projects;
CREATE POLICY "Admin mutate projects" ON projects FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read quiz_questions" ON quiz_questions;
CREATE POLICY "Public read quiz_questions" ON quiz_questions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate quiz_questions" ON quiz_questions;
CREATE POLICY "Admin mutate quiz_questions" ON quiz_questions FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read flashcards" ON flashcards;
CREATE POLICY "Public read flashcards" ON flashcards FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate flashcards" ON flashcards;
CREATE POLICY "Admin mutate flashcards" ON flashcards FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read exams" ON exams;
CREATE POLICY "Public read exams" ON exams FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate exams" ON exams;
CREATE POLICY "Admin mutate exams" ON exams FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read exam_questions" ON exam_questions;
CREATE POLICY "Public read exam_questions" ON exam_questions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate exam_questions" ON exam_questions;
CREATE POLICY "Admin mutate exam_questions" ON exam_questions FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read roadmaps" ON roadmaps;
CREATE POLICY "Public read roadmaps" ON roadmaps FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate roadmaps" ON roadmaps;
CREATE POLICY "Admin mutate roadmaps" ON roadmaps FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read roadmap_items" ON roadmap_items;
CREATE POLICY "Public read roadmap_items" ON roadmap_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate roadmap_items" ON roadmap_items;
CREATE POLICY "Admin mutate roadmap_items" ON roadmap_items FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read internships" ON internships;
CREATE POLICY "Public read internships" ON internships FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate internships" ON internships;
CREATE POLICY "Admin mutate internships" ON internships FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read community_groups" ON community_groups;
CREATE POLICY "Public read community_groups" ON community_groups FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate community_groups" ON community_groups;
CREATE POLICY "Admin mutate community_groups" ON community_groups FOR ALL USING (public.is_admin());

-- 8. Career Trajectories & Exam Roadmaps
DROP POLICY IF EXISTS "Users can view own career trajectories" ON career_trajectories;
CREATE POLICY "Users can view own career trajectories" ON career_trajectories FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can manage own career trajectories" ON career_trajectories;
CREATE POLICY "Users can manage own career trajectories" ON career_trajectories FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can view own trajectory progress" ON user_trajectory_progress;
CREATE POLICY "Users can view own trajectory progress" ON user_trajectory_progress FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can manage own trajectory progress" ON user_trajectory_progress;
CREATE POLICY "Users can manage own trajectory progress" ON user_trajectory_progress FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can view own exam roadmaps" ON exam_roadmaps;
CREATE POLICY "Users can view own exam roadmaps" ON exam_roadmaps FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can manage own exam roadmaps" ON exam_roadmaps;
CREATE POLICY "Users can manage own exam roadmaps" ON exam_roadmaps FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can view own exam progress" ON user_exam_progress;
CREATE POLICY "Users can view own exam progress" ON user_exam_progress FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can manage own exam progress" ON user_exam_progress;
CREATE POLICY "Users can manage own exam progress" ON user_exam_progress FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- 9. Social, Friend Requests & Friendships
DROP POLICY IF EXISTS "Users view relevant friend requests" ON friend_requests;
CREATE POLICY "Users view relevant friend requests" ON friend_requests FOR SELECT USING (auth.uid() = requester_user_id OR auth.uid() = receiver_user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users create own friend requests" ON friend_requests;
CREATE POLICY "Users create own friend requests" ON friend_requests FOR INSERT WITH CHECK (auth.uid() = requester_user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users update received or sent friend requests" ON friend_requests;
CREATE POLICY "Users update received or sent friend requests" ON friend_requests FOR UPDATE USING (auth.uid() = receiver_user_id OR auth.uid() = requester_user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users delete own friend requests" ON friend_requests;
CREATE POLICY "Users delete own friend requests" ON friend_requests FOR DELETE USING (auth.uid() = requester_user_id OR auth.uid() = receiver_user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users view own friendships" ON friendships;
CREATE POLICY "Users view own friendships" ON friendships FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id OR public.is_admin());

DROP POLICY IF EXISTS "Users manage own friendships" ON friendships;
CREATE POLICY "Users manage own friendships" ON friendships FOR ALL USING (auth.uid() = user_a_id OR auth.uid() = user_b_id OR public.is_admin());

-- 10. Notifications & Realtime Chat
DROP POLICY IF EXISTS "Users access own notifications" ON notifications;
CREATE POLICY "Users access own notifications" ON notifications FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Participants view conversation" ON chat_conversations;
CREATE POLICY "Participants view conversation" ON chat_conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM chat_participants cp WHERE cp.conversation_id = id AND cp.user_id = auth.uid())
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Authenticated users create conversation" ON chat_conversations;
CREATE POLICY "Authenticated users create conversation" ON chat_conversations FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' OR public.is_admin()
);

DROP POLICY IF EXISTS "Participants manage memberships" ON chat_participants;
CREATE POLICY "Participants manage memberships" ON chat_participants FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Friends send and read messages" ON chat_messages;
CREATE POLICY "Friends send and read messages" ON chat_messages FOR ALL USING (
  auth.uid() = sender_user_id
  OR EXISTS (
    SELECT 1 FROM chat_participants cp
    WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
  )
  OR public.is_admin()
);

-- 11. Study Groups, Members, Join Requests & Group Messages
DROP POLICY IF EXISTS "Public or member view study groups" ON study_groups;
CREATE POLICY "Public or member view study groups" ON study_groups FOR SELECT USING (
  visibility = 'public'
  OR creator_user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM study_group_members m
    WHERE m.group_id = id AND m.user_id = auth.uid()
  )
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Authenticated users create study groups" ON study_groups;
CREATE POLICY "Authenticated users create study groups" ON study_groups FOR INSERT WITH CHECK (auth.uid() = creator_user_id OR public.is_admin());

DROP POLICY IF EXISTS "Creator update study groups" ON study_groups;
CREATE POLICY "Creator update study groups" ON study_groups FOR UPDATE USING (auth.uid() = creator_user_id OR public.is_admin());

DROP POLICY IF EXISTS "Creator delete study groups" ON study_groups;
CREATE POLICY "Creator delete study groups" ON study_groups FOR DELETE USING (auth.uid() = creator_user_id OR public.is_admin());

DROP POLICY IF EXISTS "Members view group members" ON study_group_members;
CREATE POLICY "Members view group members" ON study_group_members FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM study_groups g
    WHERE g.id = group_id AND (g.visibility = 'public' OR g.creator_user_id = auth.uid())
  )
  OR user_id = auth.uid()
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Users join or leave group" ON study_group_members;
CREATE POLICY "Users join or leave group" ON study_group_members FOR ALL USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM study_groups g
    WHERE g.id = group_id AND g.creator_user_id = auth.uid()
  )
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Users manage own join requests or creator views" ON study_group_join_requests;
CREATE POLICY "Users manage own join requests or creator views" ON study_group_join_requests FOR ALL USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM study_groups g
    WHERE g.id = group_id AND g.creator_user_id = auth.uid()
  )
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Users view own invitations" ON study_group_invitations;
CREATE POLICY "Users view own invitations" ON study_group_invitations FOR ALL USING (
  sender_user_id = auth.uid()
  OR receiver_user_id = auth.uid()
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Accepted members read group messages" ON study_group_messages;
CREATE POLICY "Accepted members read group messages" ON study_group_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM study_group_members m
    WHERE m.group_id = group_id AND m.user_id = auth.uid() AND m.status = 'active'
  )
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Accepted members send group messages" ON study_group_messages;
CREATE POLICY "Accepted members send group messages" ON study_group_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_user_id
  AND (
    EXISTS (
      SELECT 1 FROM study_group_members m
      WHERE m.group_id = group_id AND m.user_id = auth.uid() AND m.status = 'active'
    )
    OR public.is_admin()
  )
);
