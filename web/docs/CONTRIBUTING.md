# Conventions

- Component naming: PascalCase, always (`UserCard.tsx` not `userCard.tsx`)
- File naming: match the component name exactly
- No default exports in most files — named exports are easier to track and refactor
- Types go in `/types` unless they're local to one component
- No inline API calls in components — they go through `queries/`.
- Tailwind only — no inline `style={{}}` unless there's a dynamic value Tailwind can't handle
