// packages/runtime-dom/src/nodeOps.ts
var nodeOps = {
  // 如果 anchor 为空，就相当于 appendChild
  insert: (el, parent, anchor) => parent.insertBefore(el, anchor || null),
  remove(el) {
    const parent = el.parentNode;
    parent && parent.removeChild(el);
  },
  createElement: (type) => document.createElement(type),
  createText: (text) => document.createTextNode(text),
  setText: (node, text) => node.nodeValue = text,
  setElementText: (el, text) => el.textContent = text,
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling
};

// packages/runtime-dom/src/modules/patchAttr.ts
function patchAttr(el, key, value) {
  if (!value) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, value);
  }
}

// packages/runtime-dom/src/modules/patchClass.ts
function patchClass(el, value) {
  if (!value) {
    el.removeAttribute("class");
  } else {
    el.className = value;
  }
}

// packages/runtime-dom/src/modules/patchEvent.ts
function createInovker(eventCb) {
  const inovker = (e) => {
    inovker.value(e);
  };
  inovker.value = eventCb;
  return inovker;
}
function patchEvent(el, key, value) {
  const inovkers = el.vei || (el.vei = {});
  const exisitInvoker = inovkers[key];
  if (exisitInvoker && value) {
    exisitInvoker.value = value;
    return;
  }
  const eventName = key.slice(2).toLowerCase();
  if (value) {
    const inovker = createInovker(value);
    inovkers[key] = inovker;
    el.addEventListener(eventName, inovker);
    return;
  }
  if (exisitInvoker) {
    el.removeEventListener(eventName, exisitInvoker);
    inovkers[key] = void 0;
  }
}

// packages/runtime-dom/src/modules/patchStyle.ts
function patchStyle(el, preVal, value) {
  const style = el.style;
  for (const key in value) {
    style[key] = value[key];
  }
  if (preVal) {
    for (const key in preVal) {
      if (value[key] === null) {
        style[key] = null;
      }
    }
  }
}

// packages/runtime-dom/src/patchProp.ts
function patchProp(el, key, preVal, value) {
  console.log(el, key, preVal, value);
  if (key === "class") {
    return patchClass(el, value);
  } else if (key === "style") {
    return patchStyle(el, preVal, value);
  } else if (/^on[^a-z]/.test(key)) {
    return patchEvent(el, key, value);
  } else {
    return patchAttr(el, key, value);
  }
}

// packages/runtime-core/src/index.ts
function createRenderer(renderOptions2) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp
  } = renderOptions2;
  const mountChildren = (ele, children) => {
    for (const item of children) {
      patch(null, item, ele);
    }
  };
  const mountElement = (n2, container) => {
    const { shapeFlag, type, children, props } = n2;
    const ele = hostCreateElement(type);
    if (props) {
      for (const key in props) {
        hostPatchProp(ele, key, null, props[key]);
      }
    }
    if (shapeFlag & 8 /* TEXT_CHILDREN */) {
      hostSetElementText(ele, children);
    } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
      mountChildren(ele, children);
    }
    hostInsert(ele, container);
  };
  const patch = (n1, n2, container) => {
    if (n1 === n2) {
      return;
    }
    if (n1 === null) {
      mountElement(n2, container);
      return;
    }
  };
  const render2 = (vnode, container) => {
    patch(container._vnode || null, vnode, container);
    container._vnode = vnode;
  };
  return {
    render: render2
  };
}

// packages/runtime-dom/src/index.ts
var renderOptions = {
  ...nodeOps,
  patchProp
};
var render = (vNode, container) => {
  return createRenderer(renderOptions).render(vNode, container);
};
export {
  createRenderer,
  render
};
//# sourceMappingURL=runtime-dom.js.map
