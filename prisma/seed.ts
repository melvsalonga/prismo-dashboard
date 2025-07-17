import { PrismaClient, UserRole, SocialPlatform, PostStatus, ApprovalStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create a sample team
  const team = await prisma.team.create({
    data: {
      name: "Prismo Demo Team",
      plan: "pro",
      settings: {
        autoApproval: false,
        defaultTimezone: "UTC",
        brandColors: ["#3B82F6", "#10B981"],
      },
    },
  });

  console.log("✅ Created team:", team.name);

  // Create sample users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@prismo.demo",
      name: "Admin User",
      role: UserRole.ADMIN,
      teamId: team.id,
      timezone: "America/New_York",
    },
  });

  const editorUser = await prisma.user.create({
    data: {
      email: "editor@prismo.demo",
      name: "Content Editor",
      role: UserRole.EDITOR,
      teamId: team.id,
      timezone: "Europe/London",
    },
  });

  const viewerUser = await prisma.user.create({
    data: {
      email: "viewer@prismo.demo",
      name: "Content Viewer",
      role: UserRole.VIEWER,
      teamId: team.id,
      timezone: "Asia/Tokyo",
    },
  });

  console.log("✅ Created users:", [adminUser.name, editorUser.name, viewerUser.name]);

  // Create sample social accounts
  const twitterAccount = await prisma.socialAccount.create({
    data: {
      userId: adminUser.id,
      platform: SocialPlatform.TWITTER,
      platformUserId: "123456789",
      username: "prismo_demo",
      displayName: "Prismo Demo",
      avatar: "https://example.com/avatar.jpg",
      accessToken: "demo_twitter_token",
      isActive: true,
    },
  });

  const facebookAccount = await prisma.socialAccount.create({
    data: {
      userId: adminUser.id,
      platform: SocialPlatform.FACEBOOK,
      platformUserId: "987654321",
      username: "prismo.demo",
      displayName: "Prismo Demo Page",
      avatar: "https://example.com/fb-avatar.jpg",
      accessToken: "demo_facebook_token",
      isActive: true,
    },
  });

  console.log("✅ Created social accounts for platforms:", [
    twitterAccount.platform,
    facebookAccount.platform,
  ]);

  // Create sample posts
  const draftPost = await prisma.post.create({
    data: {
      userId: editorUser.id,
      teamId: team.id,
      content: {
        text: "🚀 Excited to announce our new social media management platform! #SocialMedia #Productivity",
        media: [],
        hashtags: ["SocialMedia", "Productivity"],
        mentions: [],
        platformSpecific: {},
      },
      status: PostStatus.DRAFT,
      approvalStatus: ApprovalStatus.PENDING,
    },
  });

  const scheduledPost = await prisma.post.create({
    data: {
      userId: adminUser.id,
      teamId: team.id,
      content: {
        text: "Good morning! Here's what's trending in social media today 📈 #MorningUpdate #Trends",
        media: [],
        hashtags: ["MorningUpdate", "Trends"],
        mentions: [],
        platformSpecific: {},
      },
      status: PostStatus.SCHEDULED,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      approvalStatus: ApprovalStatus.APPROVED,
      approvedBy: adminUser.id,
      approvedAt: new Date(),
    },
  });

  console.log("✅ Created sample posts:", [draftPost.id, scheduledPost.id]);

  // Create sample analytics data
  await prisma.postAnalytics.create({
    data: {
      postId: scheduledPost.id,
      socialAccountId: twitterAccount.id,
      platformPostId: "twitter_post_123",
      likes: 42,
      shares: 8,
      comments: 5,
      reach: 1250,
      impressions: 2100,
      engagementRate: 0.044,
    },
  });

  console.log("✅ Created sample analytics data");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });