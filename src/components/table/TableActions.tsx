"use client";

import Button from "@/components/ui/Button";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

interface TableActionsProps {

  onView?: () => void;

  onEdit?: () => void;

  onDelete?: () => void;

}

export default function TableActions({
  onView,
  onEdit,
  onDelete,
}: TableActionsProps) {

  return (

    <div className="flex items-center gap-2">

      {onView && (

        <Button
          variant="outline"
          size="sm"
          onClick={onView}
        >

          <Eye size={15} />

        </Button>

      )}

      {onEdit && (

        <Button
          variant="secondary"
          size="sm"
          onClick={onEdit}
        >

          <Pencil size={15} />

        </Button>

      )}

      {onDelete && (

        <Button
          variant="danger"
          size="sm"
          onClick={onDelete}
        >

          <Trash2 size={15} />

        </Button>

      )}

    </div>

  );

}