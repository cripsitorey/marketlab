# 004 - Discover And Install Project Skills

Before starting, log in to GitHub CLI with `gh auth login` and confirm it works with `gh auth status`.

Use these prompt parts in order.

## 1. Install Skill Finder

Install this skill:
https://www.skills.sh/vercel-labs/skills/find-skills

If it is already installed, say so. If the agent must restart to load it, stop and tell me.

## 2. Find Skills For This Project

Help me find skills for this project. Inspect the repo as needed, use `find-skills`, and suggest useful options.

Group them into Tier 1, Tier 2, and Defer if that helps. Keep it brief and do not install yet.

## 3. Install And Publish

Install Tier 1 and Tier 2. From `main`, create a clearly named branch, commit, push, and open a PR when done.

Project skills should live in `.agents/skills/` with `skills-lock.json`. Update `AGENTS.md` to mention that.
