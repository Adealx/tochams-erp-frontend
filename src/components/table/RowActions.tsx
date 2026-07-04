"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  PackagePlus,
} from "lucide-react";

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onRestock?: () => void;
  onDelete?: () => void;
}

interface MenuItemType {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  danger?: boolean;
}

export default function RowActions({
  onView,
  onEdit,
  onRestock,
  onDelete,
}: RowActionsProps) {

  const [open, setOpen] =
    useState(false);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [openUp, setOpenUp] =
    useState(false);

  const buttonRef =
    useRef<HTMLButtonElement>(null);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const items: MenuItemType[] = [];

  if (onView)
    items.push({
      label: "View",
      icon: <Eye size={17} />,
      action: onView,
    });

  if (onRestock)
    items.push({
      label: "Restock",
      icon: <PackagePlus size={17} />,
      action: onRestock,
    });

  if (onEdit)
    items.push({
      label: "Edit",
      icon: <Pencil size={17} />,
      action: onEdit,
    });

  if (onDelete)
    items.push({
      label: "Delete",
      icon: <Trash2 size={17} />,
      action: onDelete,
      danger: true,
    });

  useEffect(() => {

    if (!open) return;

    function handleClickOutside(
      e: MouseEvent
    ) {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node
        ) &&
        !buttonRef.current?.contains(
          e.target as Node
        )
      ) {

        setOpen(false);

      }

    }

    function handleKeyDown(
      e: KeyboardEvent
    ) {

      if (!open) return;

      switch (e.key) {

        case "Escape":

          setOpen(false);

          buttonRef.current?.focus();

          break;

        case "ArrowDown":

          e.preventDefault();

          setActiveIndex(
            prev =>
              (prev + 1) %
              items.length
          );

          break;

        case "ArrowUp":

          e.preventDefault();

          setActiveIndex(
            prev =>
              prev === 0
                ? items.length - 1
                : prev - 1
          );

          break;

        case "Enter":

          e.preventDefault();

          items[activeIndex]?.action();

          setOpen(false);

          break;

      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [
    open,
    activeIndex,
    items,
  ]);

  const toggleMenu = () => {

    if (!buttonRef.current)
      return;

    const rect =
      buttonRef.current.getBoundingClientRect();

    const menuHeight = 220;

    const spaceBelow =
      window.innerHeight - rect.bottom;

    setOpenUp(
      spaceBelow < menuHeight
    );

    setOpen(!open);

    setActiveIndex(0);

  };

  return (

    <div className="relative">

      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="
          rounded-lg
          p-2
          transition
          hover:bg-slate-100
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      >

        <MoreVertical size={18} />

      </button>

      <div
        ref={menuRef}
        className={`
          absolute
          right-0
          z-50
          w-52
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
          transition-all
          duration-200
          origin-top-right

          ${
            open
              ? "scale-100 opacity-100 pointer-events-auto"
              : "scale-95 opacity-0 pointer-events-none"
          }

          ${
            openUp
              ? "bottom-12"
              : "top-12"
          }
        `}
      >

        {items.map(
          (
            item,
            index
          ) => (

            <button
              key={item.label}
              onClick={() => {

                item.action();

                setOpen(false);

              }}
              className={`
                flex
                w-full
                items-center
                gap-3
                px-5
                py-3
                text-left
                transition

                ${
                  index === activeIndex
                    ? "bg-blue-50"
                    : ""
                }

                ${
                  item.danger
                    ? "text-red-600"
                    : "text-slate-700"
                }

                hover:bg-slate-100
              `}
            >

              {item.icon}

              <span>

                {item.label}

              </span>

            </button>

          )
        )}

      </div>

    </div>

  );

}