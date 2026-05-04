# GEO Sales MVP

A GEO-oriented multi-source content distribution MVP for B2B passive acquisition.

The product helps teams turn product information into platform-specific content assets, simulate distribution across multiple channels, track operation records, and export structured workflow data.

## Core Workflow

Product Input
→ GEO Content Generation
→ Platform-specific Adaptation
→ Multi-channel Distribution
→ Operation Tracking
→ CSV Export
→ Downstream Lead Tracking

## Features

- Generate content drafts from product name, audience, keywords, tone, and description
- Adapt generated content for different platforms such as Zhihu, Xiaohongshu, LinkedIn, Reddit, X / Twitter, and Weibo
- Show GEO metadata including Channel Fit Score, Platform Format, Distribution Intent, and GEO Keywords
- Select channels and simulate multi-source distribution
- Save workflow state locally with localStorage
- Export generated posts, distribution logs, and leads as CSV files
- Track operation logs for distribution, export, lead updates, and workflow reset
- Manage downstream leads through a lightweight sales pipeline board

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- Framer Motion
- Lucide React
- localStorage
- Browser CSV export

## Project Structure

src/
├── GeoSalesAutomationMVP.jsx
├── services/
│   ├── contentAdaptationService.js
│   ├── csvExportService.js
│   ├── operationLogService.js
│   └── storageService.js
├── components/
│   ├── layout/
│   └── ui/
├── data/
└── pages/

## Service Modules

- contentAdaptationService.js: enriches posts with GEO keywords, channel fit scores, platform formats, and distribution intent
- csvExportService.js: exports workflow data as Excel-compatible CSV files
- storageService.js: persists selected channels, distribution logs, leads, and operation logs in localStorage
- operationLogService.js: creates traceable workflow operation records

## Run Locally

npm install
npm run dev

## Build

npm run build

## Current MVP Scope

This version focuses on GEO content adaptation and multi-source distribution simulation. Lead tracking is included as a downstream signal of distribution performance.

Current limitations:

- No real platform publishing API yet
- No backend database yet
- No user authentication yet
- No real AI model API integration yet
- No team workspace yet

## Next Steps

- Connect OpenAI or Claude API for real content generation
- Add Supabase or PostgreSQL for persistent backend storage
- Add platform publishing connectors or browser automation
- Add source-level analytics for distribution performance
- Add login and team collaboration
