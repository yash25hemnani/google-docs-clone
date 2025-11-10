import { Extension } from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

export const LineHeightExtension = Extension.create({
  name: "lineHeight",
  addOptions() {
    return {
      // types: Which node types this attribute applies to.
      types: ["paragraph", "heading"],
      defaultLineHeight: "normal",
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) return {};
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
            parseHTML: (element) => {
              return element.style.lineHeight || this.options.defaultLineHeight;
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        // tr: The current ProseMirror transaction. Used to modify document state.
        // state: The full immutable editor state (document, selection, schema, etc.).
        // dispatch: Function that applies the transaction to the editor. If omitted, the command runs in "dry-run" mode (just checks validity).
        ({ tr, state, dispatch }) => {
          // selection: Current cursor or selected range.
          const { selection } = state;
          // Ensures transaction uses the latest selection.
          tr = tr.setSelection(selection);
          // from and to → numeric positions (character offsets) in the document marking the selection boundaries.
          const { from, to } = selection;
          // Iterates through every node between the selection range.
          state.doc.nodesBetween(from, to, (node, pos) => {
            // node: The actual ProseMirror node (e.g. paragraph).
            // pos: The node’s position in the document (used to modify it).
            if (this.options.types.includes(node.type.name)) {
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineHeight,
              });
            }
          });
          // Tells Tiptap to apply your transaction to the editor state.
          if (dispatch) dispatch(tr);
          return true;
        },

      unsetLineHeight:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          tr = tr.setSelection(selection);

          const { from, to } = selection;
          state.doc.nodesBetween(from, to, (node, pos) => {
            tr = tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              lineHeight: this.options.defaultLineHeight,
            });
          });

          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
});
