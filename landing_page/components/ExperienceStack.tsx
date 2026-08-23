"use client"

import { MapPin, Calendar, ExternalLink, Briefcase } from "lucide-react"
import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack"

interface ExperienceEntry {
  id: string
  role: string
  company: string
  category: string
  dateRange: string
  location: string
  locationType: string
  achievements: string[]
  tech: string[]
  certificateUrl?: string
  certificateLabel?: string
}

const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "exp-prelax",
    role: "BACKEND DEVELOPER INTERN",
    company: "PRELAX INFOTECH",
    category: "MICROSERVICES & DISTRIBUTED SYSTEMS",
    dateRange: "MAY 2026 — JUN 2026",
    location: "Surat, Gujarat, India",
    locationType: "On-Site",
    achievements: [
      "Architected a microservices backend with 8–10 Node.js/Express services, each on an isolated PostgreSQL database instance.",
      "Engineered synchronous inter-service RPC calls using gRPC & API Gateway, with RabbitMQ topic exchanges for async event-driven logging.",
      "Eliminated N+1 query bottlenecks using Redis caching, sustaining 400–600 RPS throughput under Autocannon load tests.",
    ],
    tech: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "gRPC",
      "RabbitMQ",
      "Redis",
      "Docker",
      "Autocannon",
    ],
  },
  {
    id: "exp-infosys",
    role: "PYTHON BACKEND INTERN",
    company: "INFOSYS SPRINGBOARD",
    category: "DATA PIPELINES & PREDICTIVE APIS",
    dateRange: "AUG 2025 — OCT 2025",
    location: "Remote · Anand, Gujarat, India",
    locationType: "Remote",
    achievements: [
      "Collaborated in a 25+ member Agile/Scrum team across 4 sprints, managing automated testing suites and API documentation.",
      "Built a time-series crypto pipeline using SQLite, Pandas & NumPy with Ridge Regression return prediction models.",
      "Integrated stress testing across market volatility scenarios, exposing endpoints via FastAPI and an interactive Streamlit dashboard.",
    ],
    tech: [
      "Python",
      "FastAPI",
      "SQLite",
      "Pandas",
      "NumPy",
      "Ridge Regression",
      "Streamlit",
      "Agile/Scrum",
    ],
    certificateUrl: "https://bit.ly/Priyank-InfosysCert",
    certificateLabel: "VIEW VERIFIED CREDENTIAL",
  },
]

export const ExperienceStack = () => {
  return (
    <ContainerScroll className="min-h-[220vh] space-y-6">
      {EXPERIENCE.map((entry, index) => (
        <CardSticky
          key={entry.id}
          index={index + 1}
          incrementY={70}
          incrementZ={8}
          className="rounded-sm border border-outline/40 bg-surface shadow-lg overflow-hidden"
        >
          {/* Card Header */}
          <div className="border-b border-outline/20 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            {/* Category pill */}
            <span className="inline-block bg-surface-variant/40 border border-outline/30 text-on-surface/70 px-2.5 py-0.5 font-mono-code text-[10px] font-bold uppercase tracking-wider rounded-xs">
              {entry.category}
            </span>
            {/* Date badge */}
            <div className="flex items-center gap-1.5 font-mono-code text-on-surface/70 text-[11px] font-semibold tracking-wider border border-outline/40 px-3 py-1 rounded-xs bg-surface-variant/20">
              <Calendar className="w-3 h-3 text-primary" />
              {entry.dateRange}
            </div>
          </div>

          {/* Card Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Role & Company */}
            <div className="space-y-1">
              <h3 className="font-headline-md text-[22px] sm:text-[28px] leading-tight text-on-surface font-bold uppercase tracking-wide">
                {entry.role}
              </h3>
              <div className="flex items-center gap-2 font-mono-code text-primary font-bold uppercase text-[13px] tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                {entry.company}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 font-mono-code text-on-surface/60 text-[12px] font-semibold">
              <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
              {entry.location} · {entry.locationType}
            </div>

            {/* Achievements */}
            <ul className="space-y-2.5">
              {entry.achievements.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-mono-code text-primary font-bold mt-0.5 text-base shrink-0">
                    ›
                  </span>
                  <span className="font-body-md text-on-surface/85 text-[13.5px] md:text-[14.5px] leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 pt-1">
              {entry.tech.map((t) => (
                <span
                  key={t}
                  className="border border-on-surface/25 text-on-surface bg-surface-variant/40 px-2.5 py-1 font-mono-code text-[11px] uppercase font-bold rounded-xs tracking-wide hover:border-primary/60 hover:text-primary transition-colors duration-150"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Certificate Link */}
            {entry.certificateUrl && (
              <div className="flex justify-end pt-1">
                <a
                  href={entry.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-on-surface bg-surface text-on-surface hover:bg-on-surface hover:text-surface transition-colors duration-200 px-4 py-2 font-mono-code text-[11px] font-bold uppercase cursor-pointer rounded-xs shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {entry.certificateLabel}
                </a>
              </div>
            )}
          </div>
        </CardSticky>
      ))}
    </ContainerScroll>
  )
}
