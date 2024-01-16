'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckSquare2, Square, Trash2 } from 'lucide-react';
import { useOptimistic } from 'react';
import { Todo } from '..';
import { deleteTodo, updateTodo } from '../actions';

const TodoItem = ({ todo }: { todo: Todo }) => {
  const [optimisticTodo, updateOptimisticTodo] = useOptimistic<Todo, boolean>(
    todo,
    (state, completed) => {
      return {
        ...state,
        completed,
      };
    }
  );
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    updateOptimisticTodo(!todo.completed);
    await updateTodo(todo.id, !todo.completed);
  };
  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    await deleteTodo(todo.id);
  };
  return (
    <div className='flex items-center space-x-2 px-4 bg-white rounded-lg bg-opacity-60 py-2'>
      <div
        className={cn({ 'line-through': optimisticTodo.completed }, 'flex-1')}
      >
        {optimisticTodo.title}
      </div>
      <form onSubmit={handleUpdate}>
        <Button size={'icon'} variant={'ghost'} type='submit'>
          {optimisticTodo.completed ? <CheckSquare2 /> : <Square />}
        </Button>
      </form>
      <form onSubmit={handleDelete}>
        <Button size={'icon'} variant={'ghost'} type='submit'>
          <Trash2 size={18} />
        </Button>
      </form>
    </div>
  );
};

export default TodoItem;
