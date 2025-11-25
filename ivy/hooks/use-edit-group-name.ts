import { useState } from 'react';

export function useEditGroupName(initialName: string, onSave: (newName: string) => void) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(initialName);

  const startEditing = () => {
    setEditedName(initialName);
    setIsEditing(true);
  };

  const save = () => {
    onSave(editedName);
    setIsEditing(false);
  };

  const cancel = () => {
    setEditedName(initialName);
    setIsEditing(false);
  };

  return { isEditing, editedName, setEditedName, startEditing, save, cancel };
}