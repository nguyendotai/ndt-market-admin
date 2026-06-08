<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Documentation Rules

## Technology Notes

Use the `md/` folder for project documentation and technical notes.

Whenever a feature adds, removes, replaces, or meaningfully changes a technology, library, API client, state strategy, form strategy, validation schema, UI component system, or integration, update:

- `md/TECH_STACK_BY_FEATURE.md`

The update should happen in the same change as the code update.

For every affected feature, record:

- Feature/module name.
- Technologies and libraries used.
- Related files or folders.
- Short note explaining the reason, endpoint group, state slice, form schema, or migration detail when useful.

Keep this documentation concise and practical. It should help future contributors quickly answer: "Which technology is used for this feature, and where is it wired?"
