import {
  createUserSchema,
  updateUserSchema,
  createTeamSchema,
  createSocialAccountSchema,
  createPostSchema,
  postContentSchema,
  validateContentForPlatforms,
  twitterPostSchema,
  instagramPostSchema,
} from "@/lib/validations";
import { SocialPlatform, UserRole, ApprovalStatus } from "@/types";

describe("User Validation", () => {
  describe("createUserSchema", () => {
    it("should validate a valid user", () => {
      const validUser = {
        email: "test@example.com",
        name: "Test User",
        timezone: "America/New_York",
        role: UserRole.EDITOR,
      };

      const result = createUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidUser = {
        email: "invalid-email",
        name: "Test User",
      };

      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid email address");
      }
    });

    it("should reject empty name", () => {
      const invalidUser = {
        email: "test@example.com",
        name: "",
      };

      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Name is required");
      }
    });

    it("should apply default values", () => {
      const minimalUser = {
        email: "test@example.com",
        name: "Test User",
      };

      const result = createUserSchema.safeParse(minimalUser);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.timezone).toBe("UTC");
        expect(result.data.role).toBe(UserRole.VIEWER);
      }
    });
  });

  describe("updateUserSchema", () => {
    it("should allow partial updates", () => {
      const partialUpdate = {
        name: "Updated Name",
      };

      const result = updateUserSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it("should validate email if provided", () => {
      const invalidUpdate = {
        email: "invalid-email",
      };

      const result = updateUserSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});

describe("Team Validation", () => {
  describe("createTeamSchema", () => {
    it("should validate a valid team", () => {
      const validTeam = {
        name: "Test Team",
        plan: "pro",
        settings: {
          autoApproval: true,
          defaultTimezone: "UTC",
        },
      };

      const result = createTeamSchema.safeParse(validTeam);
      expect(result.success).toBe(true);
    });

    it("should reject empty team name", () => {
      const invalidTeam = {
        name: "",
      };

      const result = createTeamSchema.safeParse(invalidTeam);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Team name is required");
      }
    });

    it("should apply default values", () => {
      const minimalTeam = {
        name: "Test Team",
      };

      const result = createTeamSchema.safeParse(minimalTeam);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.plan).toBe("free");
        expect(result.data.settings).toEqual({});
      }
    });
  });
});

describe("Social Account Validation", () => {
  describe("createSocialAccountSchema", () => {
    it("should validate a valid social account", () => {
      const validAccount = {
        platform: SocialPlatform.TWITTER,
        platformUserId: "123456789",
        username: "testuser",
        displayName: "Test User",
        avatar: "https://example.com/avatar.jpg",
        accessToken: "valid_token",
        refreshToken: "refresh_token",
      };

      const result = createSocialAccountSchema.safeParse(validAccount);
      expect(result.success).toBe(true);
    });

    it("should reject invalid avatar URL", () => {
      const invalidAccount = {
        platform: SocialPlatform.TWITTER,
        platformUserId: "123456789",
        username: "testuser",
        displayName: "Test User",
        avatar: "invalid-url",
        accessToken: "valid_token",
      };

      const result = createSocialAccountSchema.safeParse(invalidAccount);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid avatar URL");
      }
    });
  });
});

describe("Post Content Validation", () => {
  describe("postContentSchema", () => {
    it("should validate valid post content", () => {
      const validContent = {
        text: "This is a test post",
        media: [],
        hashtags: ["test", "post"],
        mentions: ["@testuser"],
        platformSpecific: {},
      };

      const result = postContentSchema.safeParse(validContent);
      expect(result.success).toBe(true);
    });

    it("should reject text that is too long", () => {
      const invalidContent = {
        text: "a".repeat(2001), // Exceeds 2000 character limit
        media: [],
        hashtags: [],
        mentions: [],
        platformSpecific: {},
      };

      const result = postContentSchema.safeParse(invalidContent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Post text too long");
      }
    });

    it("should apply default values", () => {
      const minimalContent = {
        text: "Test post",
      };

      const result = postContentSchema.safeParse(minimalContent);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.media).toEqual([]);
        expect(result.data.hashtags).toEqual([]);
        expect(result.data.mentions).toEqual([]);
        expect(result.data.platformSpecific).toEqual({});
      }
    });
  });
});

describe("Post Validation", () => {
  describe("createPostSchema", () => {
    it("should validate a valid post", () => {
      const validPost = {
        content: {
          text: "Test post",
          media: [],
          hashtags: [],
          mentions: [],
          platformSpecific: {},
        },
        platforms: [SocialPlatform.TWITTER, SocialPlatform.FACEBOOK],
        approvalStatus: ApprovalStatus.NOT_REQUIRED,
      };

      const result = createPostSchema.safeParse(validPost);
      expect(result.success).toBe(true);
    });

    it("should require at least one platform", () => {
      const invalidPost = {
        content: {
          text: "Test post",
          media: [],
          hashtags: [],
          mentions: [],
          platformSpecific: {},
        },
        platforms: [],
      };

      const result = createPostSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("At least one platform required");
      }
    });
  });
});

describe("Platform-Specific Validation", () => {
  describe("Twitter validation", () => {
    it("should validate valid Twitter content", () => {
      const validTwitterContent = {
        text: "This is a valid Twitter post",
        media: [],
      };

      const result = twitterPostSchema.safeParse(validTwitterContent);
      expect(result.success).toBe(true);
    });

    it("should reject Twitter content exceeding character limit", () => {
      const invalidTwitterContent = {
        text: "a".repeat(281), // Exceeds 280 character limit
        media: [],
      };

      const result = twitterPostSchema.safeParse(invalidTwitterContent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Twitter posts cannot exceed 280 characters");
      }
    });

    it("should reject Twitter content with too many media items", () => {
      const invalidTwitterContent = {
        text: "Valid text",
        media: Array(5).fill({
          id: "1",
          url: "https://example.com/image.jpg",
          type: "image",
          filename: "image.jpg",
          size: 1000,
        }),
      };

      const result = twitterPostSchema.safeParse(invalidTwitterContent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Twitter allows maximum 4 media items");
      }
    });
  });

  describe("Instagram validation", () => {
    it("should validate valid Instagram content", () => {
      const validInstagramContent = {
        text: "This is a valid Instagram post",
        media: [{
          id: "1",
          url: "https://example.com/image.jpg",
          type: "image" as const,
          filename: "image.jpg",
          size: 1000,
        }],
      };

      const result = instagramPostSchema.safeParse(validInstagramContent);
      expect(result.success).toBe(true);
    });

    it("should reject Instagram content without media", () => {
      const invalidInstagramContent = {
        text: "Instagram post without media",
        media: [],
      };

      const result = instagramPostSchema.safeParse(invalidInstagramContent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Instagram posts require at least one media item");
      }
    });
  });

  describe("validateContentForPlatforms", () => {
    it("should return no errors for valid content", () => {
      const validContent = {
        text: "Valid post for all platforms",
        media: [{
          id: "1",
          url: "https://example.com/image.jpg",
          type: "image" as const,
          filename: "image.jpg",
          size: 1000,
        }],
        hashtags: [],
        mentions: [],
        platformSpecific: {},
      };

      const platforms = [SocialPlatform.TWITTER, SocialPlatform.FACEBOOK];
      const results = validateContentForPlatforms(validContent, platforms);
      
      expect(results).toHaveLength(0);
    });

    it("should return errors for invalid content", () => {
      const invalidContent = {
        text: "a".repeat(281), // Too long for Twitter
        media: [],
        hashtags: [],
        mentions: [],
        platformSpecific: {},
      };

      const platforms = [SocialPlatform.TWITTER];
      const results = validateContentForPlatforms(invalidContent, platforms);
      
      expect(results).toHaveLength(1);
      expect(results[0].platform).toBe(SocialPlatform.TWITTER);
      expect(results[0].errors).toContain("Twitter posts cannot exceed 280 characters");
    });
  });
});