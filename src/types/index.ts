// Core type definitions for Prismo Dashboard

// Enums matching Prisma schema
export enum SocialPlatform {
  TWITTER = "TWITTER",
  FACEBOOK = "FACEBOOK", 
  INSTAGRAM = "INSTAGRAM",
  LINKEDIN = "LINKEDIN",
  TIKTOK = "TIKTOK",
}

export enum UserRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

export enum PostStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  PUBLISHED = "PUBLISHED",
  FAILED = "FAILED",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NOT_REQUIRED = "NOT_REQUIRED",
}

export enum EngagementType {
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  SHARE = "SHARE",
  MENTION = "MENTION",
  DIRECT_MESSAGE = "DIRECT_MESSAGE",
}

export enum EngagementStatus {
  UNREAD = "UNREAD",
  READ = "READ",
  RESPONDED = "RESPONDED",
  ARCHIVED = "ARCHIVED",
}

// Media types
export type MediaType = "image" | "video" | "gif";

// Platform-specific content types
export interface TwitterContent {
  text: string;
  media?: MediaAsset[];
  poll?: {
    options: string[];
    duration: number;
  };
}

export interface FacebookContent {
  text: string;
  media?: MediaAsset[];
  link?: {
    url: string;
    title?: string;
    description?: string;
  };
}

export interface InstagramContent {
  text: string;
  media: MediaAsset[];
  location?: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface LinkedInContent {
  text: string;
  media?: MediaAsset[];
  article?: {
    title: string;
    description: string;
    url: string;
  };
}

export interface TikTokContent {
  text: string;
  video: MediaAsset;
  effects?: string[];
  sounds?: string[];
}

// Core entity interfaces
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
  
  // Relations (optional for populated queries)
  team?: Team;
  socialAccounts?: SocialAccount[];
  posts?: Post[];
  approvedPosts?: Post[];
  engagements?: Engagement[];
}

export interface Team {
  id: string;
  name: string;
  plan: string;
  settings: TeamSettings;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional for populated queries)
  members?: User[];
  posts?: Post[];
}

export interface TeamSettings {
  autoApproval?: boolean;
  defaultTimezone?: string;
  brandColors?: string[];
  postingSchedule?: {
    [key in SocialPlatform]?: {
      enabled: boolean;
      times: string[];
    };
  };
  notifications?: {
    email: boolean;
    push: boolean;
    slack?: string;
  };
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
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional for populated queries)
  user?: User;
  posts?: PostPlatform[];
  analytics?: PostAnalytics[];
  engagements?: Engagement[];
}

export interface MediaAsset {
  id: string;
  postId: string;
  url: string;
  type: MediaType;
  filename: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: Date;
  
  // Relations (optional for populated queries)
  post?: Post;
}

export interface PostContent {
  text: string;
  media: MediaAsset[];
  hashtags: string[];
  mentions: string[];
  platformSpecific: Record<string, unknown>;
}

export interface Post {
  id: string;
  userId: string;
  teamId?: string;
  content: PostContent;
  status: PostStatus;
  scheduledAt?: Date;
  publishedAt?: Date;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional for populated queries)
  user?: User;
  team?: Team;
  approver?: User;
  platforms?: PostPlatform[];
  analytics?: PostAnalytics[];
  engagements?: Engagement[];
  mediaAssets?: MediaAsset[];
}

export interface PostPlatform {
  id: string;
  postId: string;
  socialAccountId: string;
  platformPostId?: string;
  status: PostStatus;
  errorMessage?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional for populated queries)
  post?: Post;
  socialAccount?: SocialAccount;
}

export interface PostAnalytics {
  id: string;
  postId: string;
  socialAccountId: string;
  platformPostId: string;
  likes: number;
  shares: number;
  comments: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  lastUpdated: Date;
  createdAt: Date;
  
  // Relations (optional for populated queries)
  post?: Post;
  socialAccount?: SocialAccount;
}

export interface Engagement {
  id: string;
  postId: string;
  socialAccountId: string;
  userId: string;
  type: EngagementType;
  author: string;
  content: string;
  sentiment: number;
  status: EngagementStatus;
  platformEngagementId: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional for populated queries)
  post?: Post;
  socialAccount?: SocialAccount;
  user?: User;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form and input types
export interface CreateUserInput {
  email: string;
  name: string;
  avatar?: string;
  timezone?: string;
  role?: UserRole;
  teamId?: string;
}

export interface UpdateUserInput {
  name?: string;
  avatar?: string;
  timezone?: string;
  role?: UserRole;
}

export interface CreateTeamInput {
  name: string;
  plan?: string;
  settings?: Partial<TeamSettings>;
}

export interface UpdateTeamInput {
  name?: string;
  plan?: string;
  settings?: Partial<TeamSettings>;
}

export interface CreateSocialAccountInput {
  platform: SocialPlatform;
  platformUserId: string;
  username: string;
  displayName: string;
  avatar: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
}

export interface CreatePostInput {
  content: PostContent;
  platforms: SocialPlatform[];
  scheduledAt?: Date;
  approvalStatus?: ApprovalStatus;
  teamId?: string;
}

export interface UpdatePostInput {
  content?: Partial<PostContent>;
  platforms?: SocialPlatform[];
  scheduledAt?: Date;
  approvalStatus?: ApprovalStatus;
}

// Utility types
export type UserWithRelations = User & {
  team: Team;
  socialAccounts: SocialAccount[];
};

export type PostWithRelations = Post & {
  user: User;
  team?: Team;
  platforms: PostPlatform[];
  analytics: PostAnalytics[];
  mediaAssets: MediaAsset[];
};

export type SocialAccountWithUser = SocialAccount & {
  user: User;
};

// Platform-specific validation constraints
export interface PlatformConstraints {
  maxTextLength: number;
  maxMediaCount: number;
  supportedMediaTypes: MediaType[];
  requiresMedia: boolean;
  supportsPolls: boolean;
  supportsLinks: boolean;
}

export const PLATFORM_CONSTRAINTS: Record<SocialPlatform, PlatformConstraints> = {
  [SocialPlatform.TWITTER]: {
    maxTextLength: 280,
    maxMediaCount: 4,
    supportedMediaTypes: ["image", "video", "gif"],
    requiresMedia: false,
    supportsPolls: true,
    supportsLinks: true,
  },
  [SocialPlatform.FACEBOOK]: {
    maxTextLength: 63206,
    maxMediaCount: 10,
    supportedMediaTypes: ["image", "video"],
    requiresMedia: false,
    supportsPolls: false,
    supportsLinks: true,
  },
  [SocialPlatform.INSTAGRAM]: {
    maxTextLength: 2200,
    maxMediaCount: 10,
    supportedMediaTypes: ["image", "video"],
    requiresMedia: true,
    supportsPolls: false,
    supportsLinks: false,
  },
  [SocialPlatform.LINKEDIN]: {
    maxTextLength: 3000,
    maxMediaCount: 9,
    supportedMediaTypes: ["image", "video"],
    requiresMedia: false,
    supportsPolls: false,
    supportsLinks: true,
  },
  [SocialPlatform.TIKTOK]: {
    maxTextLength: 2200,
    maxMediaCount: 1,
    supportedMediaTypes: ["video"],
    requiresMedia: true,
    supportsPolls: false,
    supportsLinks: false,
  },
};

// Error types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface PlatformValidationResult {
  platform: SocialPlatform;
  isValid: boolean;
  errors: ValidationError[];
  warnings?: string[];
}

// Analytics aggregation types
export interface AnalyticsSummary {
  totalPosts: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  totalReach: number;
  totalImpressions: number;
  averageEngagementRate: number;
  topPerformingPost?: Post;
  platformBreakdown: Record<SocialPlatform, {
    posts: number;
    engagement: number;
    reach: number;
  }>;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  platform?: SocialPlatform;
}

// Scheduling types
export interface SchedulingOptions {
  timezone: string;
  optimalTimes?: boolean;
  customTimes?: Date[];
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    endDate?: Date;
  };
}
