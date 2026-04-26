import { z } from "zod";

const liveStatSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  suffix: z.string().optional(),
  hint: z.string().optional(),
});

const imageUrlSchema = z.string().refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
  message: "Invalid image url",
});

const brandSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  heroImageUrl: imageUrlSchema,
  heroImageAlt: z.string(),
  trialCtaLabel: z.string(),
  trialCtaHref: z.string(),
});

const pricingPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  headline: z.string(),
  priceDisplay: z.string(),
  lessonHours: z.number(),
  materialFeeDisplay: z.string(),
  activityFeeDisplay: z.string(),
  perks: z.array(z.string()),
  highlight: z.boolean().optional(),
});

const pricingSchema = z.object({
  plans: z.array(pricingPlanSchema),
  refundPolicyTitle: z.string(),
  refundPolicyBody: z.string(),
});

const scheduleWindowSchema = z.object({
  id: z.string(),
  label: z.string(),
  days: z.enum(["weekday", "weekend", "both"]),
  timeRange: z.string(),
});

const sessionStatusSchema = z.enum(["scheduled", "live", "completed"]);

const scheduleSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  classId: z.string(),
  dayOfWeek: z.number().min(0).max(6),
  startMinutes: z.number(),
  endMinutes: z.number(),
  status: sessionStatusSchema.optional(),
});

const scheduleSchema = z.object({
  windows: z.array(scheduleWindowSchema),
  sessions: z.array(scheduleSessionSchema),
  timezoneNote: z.string(),
});

const studentSchema = z.object({
  alias: z.string(),
  module: z.string(),
  englishName: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
});

const classSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number().min(1).max(6),
  gradeLabel: z.string().optional(),
  material: z.string().optional(),
  capacity: z.number(),
  enrolled: z.number(),
  teacherId: z.string(),
  teacherIds: z.array(z.string()).min(1).optional(),
  students: z.array(studentSchema),
});

const teacherSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  portraitUrl: imageUrlSchema,
  country: z.string(),
  yearsExperience: z.number(),
  tags: z.array(z.string()),
  bio: z.string(),
});

const materialSchema = z.object({
  id: z.string(),
  title: z.string(),
  coverUrl: z.string().url(),
  system: z.string(),
  vocabulary: z.string(),
  standards: z.string(),
  detail: z.string(),
});

const galleryItemSchema = z.object({
  id: z.string(),
  imageUrl: imageUrlSchema,
  caption: z.string(),
});

const navCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  href: z.string(),
  metric: z.string(),
});

const ageDistributionItemSchema = z.object({
  age: z.string(),
  count: z.number().int().nonnegative(),
});

export const institutionSchema = z.object({
  brand: brandSchema,
  liveStats: z.array(liveStatSchema),
  navCards: z.array(navCardSchema),
  pricing: pricingSchema,
  schedule: scheduleSchema,
  classes: z.array(classSchema),
  teachers: z.array(teacherSchema),
  materials: z.array(materialSchema),
  gallery: z.array(galleryItemSchema),
  ageDistribution: z.array(ageDistributionItemSchema),
});

export type InstitutionData = z.infer<typeof institutionSchema>;
