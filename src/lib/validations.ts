import { z } from "zod";
import { SocialPlatform, UserRole, PostStatus, ApprovalStatus, EngagementType, EngagementStatus } from "@/types";

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  avatar: z.string().url("Invalid avatar URL").optional(),
  timezone: z.string().default("UTC"),
  role: z.nativeEnum(UserRole).default(UserRole.VIEWER),
  teamId: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial();

// Team validation schemas
export const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required").max(100, "Team name too long"),
  plan: z.string().default("free"),
  settings: z.record(z.unknown()).default({}),
});

export const updateTeamSchema = createTeamSchema.partial();

// Social Account validation schemas
export const createSocialAccountSchema = z.object({
  platform: z.nativeEnum(SocialPlatform),
  platformUserId: z.string().min(1, "Platform user ID is required"),
  username: z.string().min(1, "Username is required"),
  displayName: z.string().min(1, "Display name is required"),
  avatar: z.string().url("Invalid avatar URL"),
  accessToken: z.string().min(1, "Access token is required"),
  refreshToken: z.string().optional(),
  tokenExpiresAt: z.date().optional(),
});

export const updateSocialAccountSchema = createSocialAccountSchema.partial();

// Media Asset validation schemas
export const mediaAssetSchema = z.object({
  url: z.string().url("Invalid media URL"),
  type: z.enum(["image", "video", "gif"]),
  filename: z.string().min(1, "Filename is required"),
  size: z.number().positive("File size must be positive"),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

// Post Content validation schemas
export const postContentSchema = z.object({
  text: z.string().max(2000, "Post text too long"),
  media: z.array(mediaAssetSchema).default([]),
  hashtags: z.array(z.string()).default([]),
  mentions: z.array(z.string()).default([]),
  platformSpecific: z.record(z.nativeEnum(SocialPlatform), z.unknown()).default({}),
});

// Post validation schemas
export const createPostSchema = z.object({
  content: postContentSchema,
  platforms: z.array(z.nativeEnum(SocialPlatform)).min(1, "At least one platform required"),
  scheduledAt: z.date().optional(),
  approvalStatus: z.nativeEnum(ApprovalStatus).default(ApprovalStatus.NOT_REQUIRED),
  teamId: z.string().optional(),
});

export const updatePostSchema = createPostSchema.partial();

// Analytics validation schemas
export const postAnalyticsSchema = z.object({
  platformPostId: z.string().min(1, "Platform post ID is required"),
  likes: z.number().nonnegative().default(0),
  shares: z.number().nonnegative().default(0),
  comments: z.number().nonnegative().default(0),
  reach: z.number().nonnegative().default(0),
  impressions: z.number().nonnegative().default(0),
  engagementRate: z.number().min(0).max(1).default(0),
});

// Engagement validation schemas
export const createEngagementSchema = z.object({
  type: z.nativeEnum(EngagementType),
  author: z.string().min(1, "Author is required"),
  content: z.string().min(1, "Content is required"),
  sentiment: z.number().min(-1).max(1).default(0),
  platformEngagementId: z.string().min(1, "Platform engagement ID is required"),
});

export const updateEngagementSchema = z.object({
  status: z.nativeEnum(EngagementStatus),
  respondedAt: z.date().optional(),
});

// Platform-specific validation
export const twitterPostSchema = z.object({
  text: z.string().max(280, "Twitter posts cannot exceed 280 characters"),
  media: z.array(mediaAssetSchema).max(4, "Twitter allows maximum 4 media items"),
});

export const facebookPostSchema = z.object({
  text: z.string().max(63206, "Facebook posts cannot exceed 63,206 characters"),
  media: z.array(mediaAssetSchema),
});

export const instagramPostSchema = z.object({
  text: z.string().max(2200, "Instagram captions cannot exceed 2,200 characters"),
  media: z.array(mediaAssetSchema).min(1, "Instagram posts require at least one media item").max(10, "Instagram allows maximum 10 media items"),
});

export const linkedinPostSchema = z.object({
  text: z.string().max(3000, "LinkedIn posts cannot exceed 3,000 characters"),
  media: z.array(mediaAssetSchema).max(9, "LinkedIn allows maximum 9 media items"),
});

export const tiktokPostSchema = z.object({
  text: z.string().max(2200, "TikTok captions cannot exceed 2,200 characters"),
  media: z.array(mediaAssetSchema).length(1, "TikTok posts require exactly one video"),
});

// Platform validation mapping
export const platformValidationMap = {
  [SocialPlatform.TWITTER]: twitterPostSchema,
  [SocialPlatform.FACEBOOK]: facebookPostSchema,
  [SocialPlatform.INSTAGRAM]: instagramPostSchema,
  [SocialPlatform.LINKEDIN]: linkedinPostSchema,
  [SocialPlatform.TIKTOK]: tiktokPostSchema,
};

// Utility function to validate content for specific platforms
export function validateContentForPlatforms(
  content: z.infer<typeof postContentSchema>,
  platforms: SocialPlatform[]
): { platform: SocialPlatform; errors: string[] }[] {
  const validationResults: { platform: SocialPlatform; errors: string[] }[] = [];

  for (const platform of platforms) {
    const validator = platformValidationMap[platform];
    const result = validator.safeParse(content);
    
    if (!result.success) {
      validationResults.push({
        platform,
        errors: result.error.errors.map(err => err.message),
      });
    }
  }

  return validationResults;
}