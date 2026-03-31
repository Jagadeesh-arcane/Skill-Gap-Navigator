"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";

type SkillLevel = "Beginner" | "Intermediate" | "Strong" | "Advanced" | "Expert";

type Skill = {
  id: string;
  name: string;
  level: SkillLevel;
};

type Gap = {
  skill: string;
  required: SkillLevel;
  current?: SkillLevel;
  focus: string;
  type: "missing" | "weak";
  category: "required" | "recommended";
};

type RoadmapStep = {
  skill: string;
  steps: string[];
};

type WeeklyItem = {
  title: string;
  detail: string;
  skill: string;
  type: "learn" | "practice" | "review";
};

type WeeklyPlan = {
  week: number;
  theme: string;
  items: WeeklyItem[];
};

type GapSummary = {
  readiness: number;
  missingCount: number;
  weakCount: number;
};

type LevelToggleProps = {
  value: SkillLevel;
  onChange: (level: SkillLevel) => void;
};

const levelOptions: { label: string; value: SkillLevel; hint: string }[] = [
  { label: "Beginner", value: "Beginner", hint: "Learning basics" },
  { label: "Intermediate", value: "Intermediate", hint: "Can deliver" },
  { label: "Strong", value: "Strong", hint: "Lead & improve" },
];

function LevelToggle({ value, onChange }: LevelToggleProps) {
  return (
    <div
      className="flex w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-semibold text-slate-700 shadow-inner shadow-slate-100"
      role="radiogroup"
      aria-label="Set skill level"
    >
      {levelOptions.map((option, index) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={`flex-1 px-3 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                : "hover:bg-white"
            } ${index > 0 ? "border-l border-slate-200" : ""}`}
            onClick={() => onChange(option.value)}
            role="radio"
            aria-checked={isActive}
            aria-label={`Set level to ${option.label}`}
          >
            <div className="flex flex-col leading-tight">
              <span>{option.label}</span>
              <span className="text-[11px] font-medium opacity-75">
                {option.hint}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

type SkillItemProps = {
  skill: Skill;
  onUpdate: (id: string, field: "name" | "level", value: string) => void;
  onRemove: (id: string) => void;
};

function SkillItem({ skill, onUpdate, onRemove }: SkillItemProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:flex-row sm:items-center sm:gap-4">
      <div className="flex w-full flex-col gap-1 sm:w-1/2">
        <label className="text-xs font-semibold text-slate-600" htmlFor={`${skill.id}-name`}>
          Skill name
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`${skill.id}-name`}
            value={skill.name}
            onChange={(event) => onUpdate(skill.id, "name", event.target.value)}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500/70"
            placeholder="Skill name"
          />
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
            {skill.level}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <LevelToggle
          value={skill.level}
          onChange={(level) => onUpdate(skill.id, "level", level)}
        />
        <button
          type="button"
          onClick={() => onRemove(skill.id)}
          className="self-end rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:self-center"
          aria-label={`Remove ${skill.name || "skill"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const levelOrder: Record<SkillLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Strong: 3,
  Advanced: 4,
  Expert: 5,
};

const normalizeName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\./g, "")
    .replace(/\s+/g, " ");

const templates = [
  {
    label: "Frontend Engineer",
    keywords: ["frontend", "web", "react", "next", "ui"],
    required: [
      { name: "JavaScript", level: "Strong" as SkillLevel, focus: "Language fundamentals and patterns" },
      { name: "TypeScript", level: "Strong" as SkillLevel, focus: "Typing, generics, and safety" },
      { name: "React", level: "Strong" as SkillLevel, focus: "Hooks, state, and effects" },
      { name: "Next.js", level: "Intermediate" as SkillLevel, focus: "App Router and data fetching" },
      { name: "CSS", level: "Intermediate" as SkillLevel, focus: "Layouts, responsive systems" },
      { name: "Testing", level: "Intermediate" as SkillLevel, focus: "Unit and integration coverage" },
      { name: "Accessibility", level: "Intermediate" as SkillLevel, focus: "ARIA, keyboard flows" },
    ],
    recommended: [
      { name: "Tailwind CSS", level: "Intermediate" as SkillLevel, focus: "Design tokens and utilities" },
      { name: "Performance", level: "Intermediate" as SkillLevel, focus: "Profiling and optimization" },
      { name: "Design Systems", level: "Intermediate" as SkillLevel, focus: "Reusable components" },
    ],
    weeklyFocus: ["Foundations", "UI Systems", "Data & Testing", "Performance & Polish"],
  },
  {
    label: "Backend Engineer",
    keywords: ["backend", "api", "server", "node", "java", "python", "go"],
    required: [
      { name: "API Design", level: "Strong" as SkillLevel, focus: "REST/GraphQL, contracts" },
      { name: "Databases", level: "Intermediate" as SkillLevel, focus: "Modeling and indexing" },
      { name: "Testing", level: "Intermediate" as SkillLevel, focus: "Integration and contract tests" },
      { name: "Authentication", level: "Intermediate" as SkillLevel, focus: "AuthN/AuthZ patterns" },
      { name: "Cloud Deployment", level: "Intermediate" as SkillLevel, focus: "CI/CD and monitoring" },
    ],
    recommended: [
      { name: "Caching", level: "Intermediate" as SkillLevel, focus: "CDN and Redis patterns" },
      { name: "Observability", level: "Intermediate" as SkillLevel, focus: "Logs, metrics, traces" },
      { name: "Security", level: "Intermediate" as SkillLevel, focus: "OWASP and threat modeling" },
    ],
    weeklyFocus: ["API & Data", "Reliability", "Security", "Scale & Ops"],
  },
  {
    label: "Data Analyst",
    keywords: ["data", "analyst", "analytics", "bi", "insights"],
    required: [
      { name: "SQL", level: "Strong" as SkillLevel, focus: "Window functions and tuning" },
      { name: "Python", level: "Intermediate" as SkillLevel, focus: "Pandas and cleaning" },
      { name: "Dashboards", level: "Intermediate" as SkillLevel, focus: "Storytelling with KPIs" },
      { name: "Statistics", level: "Intermediate" as SkillLevel, focus: "Hypothesis testing" },
      { name: "Stakeholder Communication", level: "Intermediate" as SkillLevel, focus: "Insights and recommendations" },
    ],
    recommended: [
      { name: "Experimentation", level: "Intermediate" as SkillLevel, focus: "A/B design and reads" },
      { name: "dbt/Modeling", level: "Intermediate" as SkillLevel, focus: "Transforms and lineage" },
      { name: "Data Visualization", level: "Intermediate" as SkillLevel, focus: "Chart literacy" },
    ],
    weeklyFocus: ["SQL & Cleaning", "Modeling", "Visualization", "Insights & Story"],
  },
  {
    label: "Product Manager",
    keywords: ["product", "pm", "roadmap", "manager"],
    required: [
      { name: "Product Discovery", level: "Strong" as SkillLevel, focus: "User interviews and sizing" },
      { name: "Prioritization", level: "Intermediate" as SkillLevel, focus: "RICE/MoSCoW" },
      { name: "Roadmapping", level: "Intermediate" as SkillLevel, focus: "Sequencing and outcomes" },
      { name: "Analytics", level: "Intermediate" as SkillLevel, focus: "Metrics and experiment reads" },
      { name: "Communication", level: "Intermediate" as SkillLevel, focus: "Updates and decisions" },
    ],
    recommended: [
      { name: "Design Collaboration", level: "Intermediate" as SkillLevel, focus: "Feedback loops with design" },
      { name: "Tech Fluency", level: "Intermediate" as SkillLevel, focus: "APIs, data, constraints" },
    ],
    weeklyFocus: ["Discovery", "Prioritize", "Execute", "Measure & Communicate"],
  },
  {
    label: "General Professional",
    keywords: [],
    required: [
      { name: "Communication", level: "Intermediate" as SkillLevel, focus: "Structured updates and clarity" },
      { name: "Problem Solving", level: "Intermediate" as SkillLevel, focus: "Break down problems and test quickly" },
      { name: "Collaboration", level: "Intermediate" as SkillLevel, focus: "Feedback loops and alignment" },
    ],
    recommended: [
      { name: "Time Management", level: "Intermediate" as SkillLevel, focus: "Planning and prioritization" },
    ],
    weeklyFocus: ["Foundations", "Execution", "Collaboration", "Review"],
  },
];

function buildWeeklyPlan(
  gaps: Gap[],
  baselineLabel: string,
  weeklyFocus?: string[],
): WeeklyPlan[] {
  const weekThemes = weeklyFocus && weeklyFocus.length === 4
    ? weeklyFocus
    : ["Foundations", "Build", "Ship", "Polish"];
  const weeks: WeeklyPlan[] = weekThemes.map((theme, idx) => ({
    week: idx + 1,
    theme,
    items: [],
  }));

  if (gaps.length === 0) {
    return weeks.map((week) => ({
      ...week,
      items: [
        {
          title: "General review",
          detail: "Revisit role requirements and validate your portfolio artifacts.",
          skill: baselineLabel,
          type: "review",
        },
        {
          title: "Plan next sprint",
          detail: "Pick one new capability to deepen and schedule practice time.",
          skill: baselineLabel,
          type: "practice",
        },
      ],
    }));
  }

  const orderedGaps = [...gaps].sort((a, b) => {
    if (a.category !== b.category) {
      return a.category === "required" ? -1 : 1;
    }
    if (a.type !== b.type) {
      return a.type === "missing" ? -1 : 1;
    }
    return a.skill.localeCompare(b.skill);
  });

  const tasks: WeeklyItem[] = orderedGaps.flatMap((gap) => {
    const base = gap.type === "missing" ? "Learn" : "Strengthen";
    return [
      {
        title: `${base}: ${gap.skill}`,
        detail: `Study the essentials: ${gap.focus}`,
        skill: gap.skill,
        type: "learn",
      },
      {
        title: `Practice: ${gap.skill}`,
        detail: "Build a small feature or notebook focused on this skill; keep scope to 90 minutes.",
        skill: gap.skill,
        type: "practice",
      },
      {
        title: `Review: ${gap.skill}`,
        detail: `Self-assess vs target level (${gap.required}); note gaps and evidence.`,
        skill: gap.skill,
        type: "review",
      },
    ];
  });

  let weekIndex = 0;
  tasks.forEach((task) => {
    // place task into the first week with <3 items, rotating through weeks
    let placed = false;
    for (let i = 0; i < weeks.length && !placed; i++) {
      const candidateIndex = (weekIndex + i) % weeks.length;
      if (weeks[candidateIndex].items.length < 3) {
        weeks[candidateIndex].items.push(task);
        weekIndex = candidateIndex + 1;
        placed = true;
      }
    }
  });

  // ensure each week has at least 2 items by padding with lightweight review tasks
  weeks.forEach((week) => {
    while (week.items.length < 2) {
      const fallback = orderedGaps[week.week % orderedGaps.length];
      week.items.push({
        title: "Retrospective",
        detail: "Summarize wins, blockers, and plan the next sprint.",
        skill: fallback?.skill ?? baselineLabel,
        type: "review",
      });
    }
  });

  return weeks;
}

export default function Home() {
  const [targetRole, setTargetRole] = useState("Frontend Engineer");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<Skill[]>([
    { id: "skill-1", name: "JavaScript", level: "Intermediate" },
    { id: "skill-2", name: "React", level: "Beginner" },
  ]);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan[]>([]);
  const [baseline, setBaseline] = useState("Frontend Engineer");
  const [summary, setSummary] = useState<GapSummary>({
    readiness: 0,
    missingCount: 0,
    weakCount: 0,
  });
  const [summaryText, setSummaryText] = useState("");
  const [exportStatus, setExportStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const STORAGE_KEY = "skill-gap-navigator:v1";

  const template = useMemo(() => {
    const normalized = targetRole.trim().toLowerCase();
    const matched =
      templates.find((item) =>
        item.keywords.some((keyword) => normalized.includes(keyword)),
      ) ?? templates[templates.length - 1];
    return matched;
  }, [targetRole]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.targetRole) setTargetRole(parsed.targetRole);
      if (Array.isArray(parsed.skills)) setSkills(parsed.skills);
      if (Array.isArray(parsed.roadmap)) setRoadmap(parsed.roadmap);
      if (Array.isArray(parsed.gaps))
        setGaps(
          parsed.gaps.map((gap: Gap) => ({
            ...gap,
            category: gap.category ?? "required",
          })),
        );
      if (Array.isArray(parsed.weeklyPlan)) setWeeklyPlan(parsed.weeklyPlan);
      if (parsed.baseline) setBaseline(parsed.baseline);
      if (parsed.summary) setSummary(parsed.summary);
    } catch (error) {
      console.error("Failed to restore app state", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = {
      targetRole,
      skills,
      roadmap,
      gaps,
      weeklyPlan,
      baseline,
      summary,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error("Failed to persist app state", error);
    }
  }, [targetRole, skills, roadmap, gaps, weeklyPlan, baseline, summary]);

  const handleAddSkill = () => {
    const entries = skillInput
      .split(/[,\n]/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    if (entries.length === 0) return;

    setSkills((prev) => [
      ...prev,
      ...entries.map((entry) => ({
        id: `skill-${crypto.randomUUID()}`,
        name: entry,
        level: "Beginner" as SkillLevel,
      })),
    ]);
    setSkillInput("");
  };

  const handleUpdateSkill = (
    id: string,
    field: "name" | "level",
    value: string,
  ) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id
          ? {
              ...skill,
              [field]: field === "level" ? (value as SkillLevel) : value,
            }
          : skill,
      ),
    );
  };

  const handleRemoveSkill = (id: string) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
  };

  const handleCompare = () => {
    const normalizedSkills = new Map(
      skills
        .map((skill) => ({
          ...skill,
          name: skill.name.trim(),
        }))
        .filter((skill) => skill.name.length > 0)
        .map((skill) => [normalizeName(skill.name), skill]),
    );

    const nextGaps: Gap[] = [];
    let strongOrBetterCount = 0;

    const processSkill = (
      skillDef: { name: string; level: SkillLevel; focus: string },
      category: "required" | "recommended",
    ) => {
      const key = normalizeName(skillDef.name);
      const current = normalizedSkills.get(key);
      const currentLevelValue = current
        ? levelOrder[current.level]
        : undefined;
      const requiredLevelValue = levelOrder[skillDef.level];
      const isMissing = !current;
      const isWeak =
        currentLevelValue !== undefined && currentLevelValue < requiredLevelValue;

      if (isMissing || isWeak) {
        nextGaps.push({
          skill: skillDef.name,
          required: skillDef.level,
          current: current?.level,
          focus: skillDef.focus,
          type: isMissing ? "missing" : "weak",
          category,
        });
      } else if (category === "required") {
        strongOrBetterCount += 1;
      }
    };

    template.required.forEach((item) => processSkill(item, "required"));
    template.recommended.forEach((item) => processSkill(item, "recommended"));

    const readiness =
      template.required.length === 0
        ? 100
        : Math.round((strongOrBetterCount / template.required.length) * 100);

    const nextSummary: GapSummary = {
      readiness,
      missingCount: nextGaps.filter((gap) => gap.type === "missing" && gap.category === "required").length,
      weakCount: nextGaps.filter((gap) => gap.type === "weak" && gap.category === "required").length,
    };

    const nextRoadmap: RoadmapStep[] = nextGaps.map((gap) => ({
      skill: gap.skill,
      steps: [
        `Target: move from ${gap.current ?? "-"} to ${gap.required}`,
        `Study: focus on ${gap.focus.toLowerCase()}`,
        "Practice: ship a small project and request feedback",
        "Proof: document results and add metrics to your portfolio",
      ],
    }));

    setBaseline(template.label);
    setGaps(nextGaps);
    setRoadmap(nextRoadmap);
    setSummary(nextSummary);
    setWeeklyPlan(buildWeeklyPlan(nextGaps, template.label, template.weeklyFocus));
    setExportStatus("idle");
  };

  const buildExportSummary = () => {
    const topGaps = gaps
      .filter((gap) => gap.category === "required")
      .slice(0, 5);
    const topRecommended = gaps
      .filter((gap) => gap.category === "recommended")
      .slice(0, 3);
    const gapLines =
      topGaps.length === 0
        ? ["- No required gaps detected; keep practicing and validating artifacts."]
        : topGaps.map(
            (gap) =>
              `- ${gap.skill}: ${gap.type.toUpperCase()} (current: ${
                gap.current ?? "missing"
              }, required: ${gap.required})`,
          );

    const recLines =
      topRecommended.length === 0
        ? []
        : [
            "",
            "Top Recommended Gaps:",
            ...topRecommended.map(
              (gap) =>
                `- ${gap.skill}: ${gap.type.toUpperCase()} (current: ${
                  gap.current ?? "missing"
                }, desired: ${gap.required})`,
            ),
          ];

    const roadmapLines =
      weeklyPlan.length === 0
        ? ["- Generate a plan to see weekly actions."]
        : weeklyPlan.flatMap((week) => [
            `Week ${week.week} - ${week.theme}`,
            ...week.items.map(
              (item) =>
                `  - [${item.type}] ${item.title} - ${item.detail} (skill: ${item.skill})`,
            ),
          ]);

    const text = [
      "Skill Gap Navigator Summary",
      `Target Role: ${targetRole}`,
      `Baseline Matched: ${baseline}`,
      `Readiness: ${summary.readiness}%`,
      "",
      "Top Skill Gaps:",
      ...gapLines,
      ...recLines,
      "",
      "4-Week Roadmap:",
      ...roadmapLines,
    ].join("\n");

    setSummaryText(text);
    return text;
  };

  const handleExport = async () => {
    const text = buildExportSummary();
    const copyWithFallback = () => {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        return true;
      } catch (error) {
        console.error("Fallback copy failed", error);
        return false;
      }
    };

    const canUseClipboard =
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function";

    try {
      if (canUseClipboard) {
        await navigator.clipboard.writeText(text);
        setExportStatus("copied");
      } else {
        const ok = copyWithFallback();
        setExportStatus(ok ? "copied" : "error");
      }
    } catch (error) {
      console.error("Failed to copy summary", error);
      const ok = copyWithFallback();
      setExportStatus(ok ? "copied" : "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-10">
        <header className="space-y-3 text-center md:text-left">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800 md:mx-0">
            Skill Gap Navigator
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Chart the path to your next role
          </h1>
          <p className="text-base text-slate-600 sm:text-lg">
            Compare your current strengths against a role baseline and get a
            focused learning roadmap, right from the browser.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-2xl border border-slate-100 bg-white/90 shadow-lg shadow-blue-100/30 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  Your profile
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                  Define the target and your current stack
                </h2>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Baseline: {baseline}
              </span>
            </div>

            <div className="space-y-6 p-6">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-slate-800"
                  htmlFor="target-role"
                >
                  Target role
                </label>
                <input
                  id="target-role"
                  value={targetRole}
                  onChange={(event) => setTargetRole(event.target.value)}
                  placeholder="e.g. Frontend Engineer"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-slate-100 outline-none transition focus:ring-2 focus:ring-blue-500/70"
                />
                <p className="text-xs text-slate-500">
                  We'll auto-match a baseline and show gaps that matter most for
                  that role.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-sm font-medium text-slate-800">
                    Current skills
                  </label>
                  <span className="text-xs text-slate-500">
                    Add each skill you want to benchmark (comma or new line to add multiple)
                  </span>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      value={skillInput}
                      onChange={(event) => setSkillInput(event.target.value)}
                      placeholder="Add skill(s), e.g. Testing, TypeScript"
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500/70"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                    >
                      Add skill
                    </button>
                  </div>

                  <div className="space-y-2">
                    {skills.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No skills yet. Add at least one to compare.
                      </p>
                    )}
                    {skills.map((skill) => (
                      <SkillItem
                        key={skill.id}
                        skill={skill}
                        onUpdate={handleUpdateSkill}
                        onRemove={handleRemoveSkill}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Ready to compare?
                  </p>
                  <p className="text-xs text-slate-500">
                    We highlight what to level up and create a roadmap.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCompare}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/40 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                >
                  <span>Compare skills</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-blue-100/30 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Readiness score
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    How close you are to the target
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                    {summary.readiness}%
                  </span>
                  <button
                    type="button"
                    onClick={handleExport}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                    aria-label="Copy summary to clipboard"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                    </svg>
                    Export summary
                  </button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm font-semibold text-slate-800">
                  <p className="text-xs text-slate-500">Missing skills</p>
                  <p className="text-lg">{summary.missingCount}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm font-semibold text-slate-800">
                  <p className="text-xs text-slate-500">Weak skills</p>
                  <p className="text-lg">{summary.weakCount}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm font-semibold text-slate-800">
                  <p className="text-xs text-slate-500">Baseline</p>
                  <p className="text-lg">{baseline}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Score is deterministic: (skills at or above required level) / (skills required for the role).
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-blue-100/30 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Skill gap analysis
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    What to level up next
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {gaps.length === 0
                    ? "No data yet"
                    : `${gaps.length} gap${gaps.length === 1 ? "" : "s"}`}
                </span>
              </div>

              {gaps.length === 0 ? (
                <div className="flex items-start gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-1 h-5 w-5 text-slate-400"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12h6M12 9v6" />
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-800">No gaps yet</p>
                    <p>
                      Run a comparison to see what to focus on. We'll cross-check your skills against the {baseline} baseline.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {gaps.map((gap) => (
                    <div
                      key={gap.skill}
                      className={`rounded-xl border border-slate-200 bg-gradient-to-r from-white to-blue-50/70 p-4 shadow-sm border-l-4 ${
                        gap.category === "required"
                          ? "border-l-blue-500"
                          : "border-l-emerald-400"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {gap.skill}
                          </p>
                          <p className="text-xs text-slate-600">
                            Focus: {gap.focus}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                              {gap.category === "required" ? "Required" : "Recommended"}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                              {gap.type === "missing" ? "Missing" : "Weak"}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-xs font-semibold sm:flex-row sm:items-center">
                          <span className="rounded-full bg-slate-900 px-3 py-1 text-white">
                            Target: {gap.required}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                            Yours: {gap.current ?? "Missing"}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 ${
                              gap.type === "missing"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {gap.type === "missing" ? "Missing" : "Weak"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-blue-100/30 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Learning roadmap
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Concrete next steps
                  </h3>
                </div>
              </div>
              {roadmap.length === 0 ? (
                <div className="flex items-start gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-1 h-5 w-5 text-slate-400"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-800">Roadmap not ready</p>
                    <p>Compare your skills to generate a concise, 4-step plan for each gap.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {roadmap.map((item) => (
                    <div
                      key={item.skill}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.skill}
                        </p>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          4-step sprint
                        </span>
                      </div>
                      <ul className="space-y-1 text-sm text-slate-700">
                        {item.steps.map((step) => (
                          <li key={step} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-blue-100/30 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Weekly plan (4 weeks)
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Stay on track week by week
                  </h3>
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  Regenerates when you compare
                </span>
              </div>

              {weeklyPlan.length === 0 ? (
                <div className="flex items-start gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-1 h-5 w-5 text-slate-400"
                    aria-hidden="true"
                  >
                    <path d="M8 7h13" />
                    <path d="M8 12h13" />
                    <path d="M8 17h13" />
                    <path d="M3 7h.01" />
                    <path d="M3 12h.01" />
                    <path d="M3 17h.01" />
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-800">No weekly plan yet</p>
                    <p>Compare skills to get a 4-week schedule with 2-3 focus items per week.</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {weeklyPlan.map((week) => (
                    <div
                      key={week.week}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                            Week {week.week}
                          </p>
                          <p className="text-sm font-semibold text-slate-900">
                            {week.theme}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                          {week.items.length} items
                        </span>
                      </div>
                      <ul className="space-y-2 text-sm text-slate-800">
                        {week.items.map((item, idx) => (
                          <li
                            key={`${week.week}-${item.title}-${idx}`}
                            className="flex gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
                          >
                            <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{item.title}</span>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                  {item.type}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600">{item.detail}</p>
                              <p className="text-xs text-slate-500">
                                Skill: {item.skill}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-blue-100/30 backdrop-blur-md">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Summary preview
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Ready to share
                  </h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    exportStatus === "copied"
                      ? "bg-emerald-100 text-emerald-800"
                      : exportStatus === "error"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-100 text-slate-700"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {exportStatus === "copied"
                    ? "Copied"
                    : exportStatus === "error"
                      ? "Copy failed"
                      : "Not copied"}
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                <pre className="whitespace-pre-wrap text-xs text-slate-800">
                  {summaryText || "Click Export summary to generate a preview."}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
