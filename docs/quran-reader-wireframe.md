# Quran Reader UI Wireframe Specification

Audience: React + Ant Design developers
Scope: Mobile-first Quran reading experience for Muslim Daily

This document defines component hierarchy, layout diagrams, UI behavior rules, and state interactions for the Quran experience.

---

## Design Goals

- Modern, minimal, calm UI optimized for long reading sessions
- Fast navigation to continue reading and bookmarks
- Clear, readable Arabic typography with generous spacing
- Consistent theming across Light, Dark, Sepia, Night Blue
- Mobile-first with smooth scrolling and sticky controls

---

## Global System

### Typography

- Arabic font: large, comfortable, with high line-height
- Translation font: smaller, readable, clear contrast to Arabic
- Tafsir font: slightly smaller than translation
- Ayah number badge: compact, bold

Recommended sizes (mobile base):
- Arabic text: 22-26px
- Translation: 14-16px
- Tafsir: 13-15px
- UI labels: 12-14px

### Spacing

- Vertical spacing: generous (12-20px between ayah cards)
- Card padding: 14-18px
- Section padding: 16px

### Theme Tokens

Themes must control:
- background
- text color
- card surfaces
- highlight colors

Tokens:
- `bgPrimary`
- `bgSecondary`
- `cardSurface`
- `textPrimary`
- `textSecondary`
- `accent`
- `accentSoft`
- `border`
- `shadow`

Theme Set:
- Light
- Dark
- Sepia
- Night Blue

---

## Page 1: Quran Home

### Purpose
Landing page for Quran section with quick actions and resume context.

### Component Hierarchy

- `QuranHomePage`
- `HeaderBar`
- `SurahSearchInput`
- `ContinueReadingCard`
- `SectionTitle`
- `RecentSurahsRow`
- `RandomAyahGenerator`
- `SurahListPreview`
- `FavoriteAyahsShortcut`
- `BookmarksShortcut`
- `RecentlyOpenedSurahs`
- `ReadingStatistics`

### Layout Diagram (Mobile)

```
[HeaderBar: Quran]
[Search Surah Input]

[Continue Reading Card]
[Recent Surahs Row]

[Random Ayah Generator]
[Surah List Preview]

[Favorite Ayahs Shortcut]
[Bookmarks Shortcut]

[Recently Opened Surahs]
[Reading Statistics]
```

### Behavior Rules

- `ContinueReadingCard` shows last read surah + ayah range, with quick resume.
- `RandomAyahGenerator` fetches a random ayah and shows a compact preview.
- `SurahListPreview` shows top 5-10 surahs with �View All�.
- `RecentSurahsRow` is horizontally scrollable.

### State Interactions

- `lastRead`: { surahId, ayahNumber, progressPercent }
- `recentSurahs`: [surahId]
- `randomAyah`: { surahId, ayahNumber }
- `readingStats`: { totalMinutes, streakDays, lastDate }

---

## Page 2: Surah List Page

### Purpose
Browse and search all surahs, with quick index and filtering.

### Component Hierarchy

- `SurahListPage`
- `HeaderBar`
- `SurahSearchInput`
- `FilterRow`
  - `FilterChip` (All, Meccan, Medinan)
- `QuickIndex`
- `RandomAyahCard`
- `SurahList`
  - `SurahCard`

### Layout Diagram (Mobile)

```
[HeaderBar: Surah List]
[Search by name/number]
[Filter Chips: All | Meccan | Medinan]
[Quick Index: 1-114 scroll]

[Random Ayah Card]

[Scrollable Surah List]
  [Surah Card]
  [Surah Card]
  ...
```

### Surah Card Content

- Surah Number
- Arabic Name
- English Name
- Revelation Type
- Ayah Count

### Behavior Rules

- Search filters by surah number or name (Arabic or English).
- Quick index jumps to the selected surah number.
- Filter applies on the list only.
- Tap `SurahCard` -> open Surah Reader.

### Random Ayah Card

- Shows single random ayah preview.
- On tap: opens a new page showing 7 consecutive ayahs including translations.

### State Interactions

- `searchQuery: string`
- `filter: all | meccan | medinan`
- `randomAyah: { surahId, ayahNumber }`

---

## Page 3: Surah Reader (Primary Screen)

### Purpose
Immersive reading experience with actions and tafsir access.

### Component Hierarchy

- `SurahReaderPage`
- `ReaderToolbar`
  - `BackButton`
  - `SurahTitle`
  - `ReaderSettingsButton`
  - `BookmarkButton`
- `AyahList`
  - `AyahCard`
    - `AyahNumberBadge`
    - `ArabicText`
    - `TranslationText`
    - `TafsirSection` (expandable)
    - `ActionRow`
      - `Bookmark`
      - `Favorite`
      - `Copy`
      - `Share`
      - `OpenTafsir`

### Layout Diagram (Mobile)

```
[Sticky Toolbar: Back | Surah Name | Settings | Bookmark]

[Scrollable Ayah List]
  [Ayah Card]
    [Ayah Number Badge]
    [Arabic Text - Large]
    [Translation]
    [Tafsir (collapsed/expanded)]
    [Action Row]
  ...
```

### Behavior Rules

- Toolbar is sticky on scroll.
- Ayah card is bounded with soft borders and calm shadow.
- Tap ayah to reveal action row.
- Long press toggles quick bookmark.
- Current ayah is subtly highlighted.
- Action row auto-hides after short idle time.

### State Interactions

- `currentAyahId`
- `expandedTafsirAyahId`
- `readerSettings`: { mode, fontSize, lineSpacing, theme, showNumbers, wordByWord }
- `favorites: Set<ayahId>`
- `bookmarks: Set<ayahId>`

---

## Page 4: Reader Settings Panel

### Purpose
Control reading mode and typography.

### Component Hierarchy

- `ReaderSettingsSheet`
- `ModeSelector`
- `FontSizeSlider`
- `LineSpacingSlider`
- `ThemeSelector`
- `ToggleRow`
  - `ShowAyahNumbers`
  - `ShowWordByWord`

### Layout Diagram (Mobile)

```
[Bottom Sheet]
[Reading Mode Selector]
[Font Size Slider]
[Line Spacing Slider]
[Theme Selector]
[Toggle: Show Ayah Numbers]
[Toggle: Show Word by Word]
```

### Behavior Rules

- Opens from the bottom, dismiss on swipe down.
- All changes are applied live to reader.

---

## Page 5: Bookmark Manager

### Purpose
Manage all bookmarked ayahs.

### Component Hierarchy

- `BookmarkManagerPage`
- `HeaderBar`
- `BookmarkList`
  - `BookmarkItem`
    - `SurahName`
    - `AyahPreview`
    - `ActionRow` (Jump, Remove)

### Layout Diagram (Mobile)

```
[HeaderBar: Bookmarks]
[Bookmark List]
  [Bookmark Item]
    [Surah Name]
    [Ayah Preview]
    [Jump | Remove]
```

---

## Page 6: Favorites Page

### Purpose
Manage and read saved ayahs.

### Component Hierarchy

- `FavoritesPage`
- `HeaderBar`
- `FavoritesList`
  - `AyahCard` (same as reader card)

---

## Interaction Summary

- Smooth scroll on all lists
- Sticky reader toolbar on Surah Reader
- Highlight current ayah based on scroll position
- Tap ayah -> reveal action row
- Long press -> quick bookmark

---

## Notes for Implementation

- Use Ant Design Mobile components where appropriate, but keep custom card layout for ayahs.
- Keep card design minimal and calm; no heavy borders.
- Use React functional components and hooks.
- Wire theme tokens to Ant Design theming system.

---

End of specification.
