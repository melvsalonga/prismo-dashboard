// Core type definitions for Prismo Dashboard

export enum SocialPlatform {
  TWITTER = "twitter",
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  LINKEDIN = "linkedin",
  TIKTOK = "tiktok",
}

export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  VIEWER = "viewer",
}

export enum PostStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  PUBLISHED = "published",
  FAILED = "failed",
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NOT_REQUIRED = "not_required",
}

export enum EngagementType {
  LIKE = "like",
  COMMENT = "comment",
  SHARE = "share",
  MENTION = "mention",
  DIRECT_MESSAGE = "direct_message",
}

export enum EngagementStatus {
  UNREAD = "unread",
  READ = "read",
  RESPONDED = "responded",
  ARCHIVED = "archived",
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  timezone: string;
  role: UserRole;
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  plan: string;
  members: User[];
  settings: Record<string, unknown>;
  createdAt: Date;
}

export interface SocialAccount {
  id: string;
  userId: string;
  platform: SocialPlatform;
  platformUserId: string;
  username: string;
  displayName: string;
  avatar: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  isActive: boolean;
  lastSyncAt: Date;
}

export interface MediaAsset {
  id: string;
  url: string;
  type: "image" | "video" | "gif";
  filename: string;
  size: number;
  width?: number;
  height?: number;
}

export interface PostContent {
  text: string;
  media: MediaAsset[];
  hashtags: string[];
  mentions: string[];
  platformSpecific: Record<SocialPlatform, unknown>;
}

export interface Post {
  id: string;
  userId: string;
  teamId?: string;
  content: PostContent;
  platforms: SocialPlatform[];
  status: PostStatus;
  scheduledAt?: Date;
  publishedAt?: Date;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostAnalytics {
  postId: string;
  platform: SocialPlatform;
  platformPostId: string;
  likes: number;
  shares: number;
  comments: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  lastUpdated: Date;
}

export interface Engagement {
  id: string;
  postId: string;
  platform: SocialPlatform;
  type: EngagementType;
  author: string;
  content: string;
  sentiment: number;
  status: EngagementStatus;
  respondedAt?: Date;
  createdAt: Date;
}
