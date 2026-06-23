Build a data-agnostic Portfolio for dynamic data related to projects or patents,
that is not rigid to only use hardcoded static data, instead using a pipeline to
extract data from a file, transform and load it, adjusting the build as needed
for the data, without any arbitrary limits on number of items

use strict warm color scheme across all of UI including but not limited to
hover/selected item state, selected text/media/attachment highlights (should be
lime green), paddings, shadows and icons, without using any default themes from
tailwind or such, ensure granular control by using HTML, HTMX and CSS/Tailwind
with global defined strictly, JSX/TSX, And avoiding any elements that do not
allow change of colors for certain parts (  dropdowns, checcboxes, and such) use
only custom made elements.

Schema for data file should be as such

[TITLE/LABEL] 
META DATA
"DESCRIPTION"

Aswell as any attachments/media either via relative path or absolute path or web
urls,

add a data option for using GitHub API to extract the information without manual
effort aswell, to retrieve project data for every repo, including the README.md
for description, and if any image files exist, use it as a thumbnail

The frame of the items should be hexagonal and follow a honeycomb pattern
geometry, not horizontal rows or vertical rows, so join them in the accurate
honeycomb pattern
