import React, { useEffect, useRef, useCallback, useMemo } from "react";
import TreeView from "devextreme-react/tree-view";
import { useNavigation } from "../../contexts/navigation.context";
import { useScreenSize } from "../../utils/media-query";
import "./side-navigation-menu.scss";
import { useTranslation } from "react-i18next";

import * as events from "devextreme/events";
import query from "devextreme/data/query";
import { useAuth } from "../../contexts/auth.context";

export default function SideNavigationMenu(props) {
  const { children, selectedItemChanged, openMenu, compactMode, onMenuReady } =
    props;

  const { isLarge } = useScreenSize();
  const { t } = useTranslation();
  const {
    user: { navigationItems },
  } = useAuth();

  function normalizePath() {
    return query(navigationItems)
      .sortBy("priority")
      .toArray()
      .map((item) => {
        const children =
          item?.children && item?.children?.length > 0
            ? item.children.map((m) => {
                return {
                  text: t(m.translate),
                  icon: m.icon ?? undefined,
                  path: m.url,
                };
              })
            : undefined;

        return {
          ...item,
          text: t(item.translate),
          items: children,
          expanded: isLarge,
          path: item.url && !/^\//.test(item.url) ? `/${item.url}` : item.url,
        };
      });
  }

  const items = useMemo(
    normalizePath,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const {
    navigationData: { currentPath },
  } = useNavigation();

  const treeViewRef = useRef<TreeView>(null);
  const wrapperRef = useRef();
  const getWrapperRef = useCallback(
    (element) => {
      const prevElement = wrapperRef.current;
      if (prevElement) {
        events.off(prevElement, "dxclick");
      }

      wrapperRef.current = element;
      events.on(element, "dxclick", (e) => {
        openMenu(e);
      });
    },
    [openMenu]
  );

  useEffect(() => {
    const treeView = treeViewRef.current && treeViewRef.current.instance;
    if (!treeView) {
      return;
    }

    if (currentPath !== undefined) {
      treeView.selectItem(currentPath);
      treeView.expandItem(currentPath);
    }

    if (compactMode) {
      treeView.collapseAll();
    }
  }, [currentPath, compactMode]);

  return (
    <div
      className={"dx-swatch-additional side-navigation-menu"}
      ref={getWrapperRef}
    >
      {children}
      <div className={"menu-container"}>
        <TreeView
          ref={treeViewRef}
          items={items}
          keyExpr={"path"}
          selectionMode={"single"}
          focusStateEnabled={false}
          expandEvent={"click"}
          onItemClick={selectedItemChanged}
          onContentReady={onMenuReady}
          width={"100%"}
        />
      </div>
    </div>
  );
}
