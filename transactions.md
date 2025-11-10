# 🧩 Understanding Transactions in Tiptap

## 1. What Is a Transaction?

A **transaction (`tr`)** in Tiptap (built on ProseMirror) represents a single atomic change to the editor state.  
It includes:
- The document changes (insert, delete, style, etc.)
- Selection updates
- Metadata about what changed

Transactions make editor updates safe, undoable, and predictable.

You typically use them when modifying **node attributes**, **multiple nodes**, or doing something that can’t be handled by a simple `chain()` command.

---

## 2. The Two Main Ways to Apply Changes

### **A. Using Chainable Commands**
```ts
editor.chain().setMark("textStyle", { fontSize: "16px" }).run();
```
- Used for **inline text changes**.
- Internally creates and dispatches its own transaction.
- Cleaner, declarative syntax.

### **B. Using Transactions Directly**
```ts
({ tr, state, dispatch }) => {
  const { from, to } = state.selection;
  state.doc.nodesBetween(from, to, (node, pos) => {
    tr.setNodeMarkup(pos, undefined, { ...node.attrs, lineHeight: "1.8" });
  });
  if (dispatch) dispatch(tr);
  return true;
}
```
- Used when working with **block-level node attributes**.
- Gives fine-grained control over which nodes change.
- Must explicitly `dispatch(tr)` to apply the change.

---

## 3. Inline vs. Block Properties

| Property Type | Examples | Affects | Representation in Tiptap | Use Transactions? |
|----------------|-----------|----------|---------------------------|-------------------|
| **Inline (Text-level)** | `font-size`, `color`, `font-family`, `letter-spacing` | Characters or words | **Mark** (`textStyle`) | ❌ No |
| **Block (Layout-level)** | `line-height`, `text-align`, `margin`, `padding`, `indent` | Entire paragraph or heading | **Node attribute** | ✅ Yes |

---

## 4. Why `line-height` Uses Transactions

- It affects the **layout of the whole block**, not specific text ranges.  
- You can’t have different line-heights within one paragraph.  
- Therefore, it’s stored as a **node attribute** on `paragraph` and `heading` nodes.  
- Changing node attributes requires using a **transaction** (`tr.setNodeMarkup`).

Example:
```ts
state.doc.nodesBetween(from, to, (node, pos) => {
  if (this.options.types.includes(node.type.name)) {
    tr.setNodeMarkup(pos, undefined, { ...node.attrs, lineHeight });
  }
});
```

---

## 6. When to Use Which

| Use Case | Use `chain()` | Use Transaction (`tr`) |
|-----------|---------------|------------------------|
| Bold, Italic, Color, Font Size | ✅ | ❌ |
| Letter Spacing | ✅ | ❌ |
| Line Height, Alignment | ❌ | ✅ |
| Indentation, Margins | ❌ | ✅ |
| Wrapping/Replacing Nodes | ❌ | ✅ |
| Applying Marks Inline | ✅ | ❌ |

---

## 7. TL;DR Rules

- **Inline style → Mark → `chain()`**
- **Block style → Node attribute → Transaction**
- **If it affects document structure or multiple nodes → Transaction**
- **If it just styles selected text → Chainable Mark Command**

---

## 8. Quick Reference Summary

| CSS Property | Tiptap Type | Needs Transaction? |
|---------------|--------------|--------------------|
| `font-size` | Mark (`textStyle`) | ❌ |
| `color` | Mark (`textStyle`) | ❌ |
| `background-color` | Mark (`textStyle`) | ❌ |
| `letter-spacing` | Mark (`textStyle`) | ❌ |
| `line-height` | Node Attribute | ✅ |
| `text-align` | Node Attribute | ✅ |
| `margin` | Node Attribute | ✅ |
| `padding` | Node Attribute | ✅ |
| `indent` | Node Attribute | ✅ |

---

**Summary:**  
Use `transactions` when you need direct control over the document structure or block-level styling.  
Use `chain()` when applying simple inline text formatting.
