
# Code Style Guide
- Use Google and Airbnb Javascript style guides for reference.
- Don't use 1 letter variable names except for a few cases:
  - Integer loop variables, indices, and counters (e.g., i, j, k)
  - Coordinates (e.g., x, y)
  - Standard math/exception variables within short blocks (e.g., e for an caught error / exception)
- Don't use 1 letter function names
- Prefer declaring functions using the `function` keyword and not `const`
- Prefer using curly braces for all control statements (if-else, for, loops, etc)
- Prefer human readability over putting as much code onto one line as possible. Use newlines where you can, refer to most of the existing code base for reference.
- Prefer using if-else-if-else control flows over nested ternary
- Use "===" and "!==" for comparisons, not "==" and "!="
- Be careful about checking only for null. undefined is also something similar in JS that is worth checking for. Or just run a truthy check in JS like `if (myVar) {}`

## CSS Style guidelines:
- Refer to Google's CSS style guide for reference - https://google.github.io/styleguide/htmlcssguide.html#CSS
- Avoid using inline CSS styles.
- Avoid using `!important` unless absolutely necessary (but then think about other alternatives)
- Use globals.css for CSS rules that are used in multiple places across the project
- Don't duplicate CSS class names that already exist in globals.css, could lead to conflicts
- Don't use CSS from page-specific files in other pages (I noticed a lot of class names from exposure-check.css were being used in other files, which is wrong because those styles wouldn't get loaded until the user navigates to the Exposure Check page.)
- For CSS rules that are only used on one page, make a dedicated `.css` or `.module.css` file and import that into the file where it's used, and just use it there.
- Prefer using CSS variables for colors.
  - For colors used in a lot of different pages, putting them in the `:root` section in `globals.css` is fine. For colors used in only 1 file, declaring it in that CSS file is fine.
- Don't repeat yourself. If two (or more) selectors would have identical declarations, combine them into a single comma-separated rule instead of writing duplicate blocks.
  - Don't do this:
    ```CSS
    .riskCell {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .statusCell {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    ```
  - Do this instead:
    ```CSS
    .riskCell,
    .statusCell {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    ```
  - When selectors share some declarations but diverge in others, keep the shared declarations in the comma-separated rule, then add a separate rule (reusing the same class name) for only the diverging declarations.
    ```CSS
    .riskCell,
    .statusCell {
      ...see above
    }

    /* .statusCell keeps the shared rules above and only overrides the gap */
    .statusCell {
      gap: 10px;
    }
    ```
- Don't write all rules on one line.
  - Don't do this: `.class-name { width:7px; height:7px; border-radius:50%; flex-shrink:0; }`
  - Do this instead (the curly braces and spacing here is also our ideal code style):
    ```CSS
    .class-name {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    ```
