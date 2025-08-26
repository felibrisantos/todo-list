"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  taskName: z.string().min(1, {
    message: "O nome da tarefa não pode estar vazio.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type Task = {
  id: string;
  text: string;
};

const LOCAL_STORAGE_KEY = "tasks-list";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
    },
  });

  function handleEditClick(task: Task) {
    setTaskToEdit(task);
    form.setValue("taskName", task.text);
    setIsDialogOpen(true);
  }

  function onSubmit(values: FormValues) {
    if (taskToEdit) {
      const updatedTasks = tasks.map((task) =>
        task.id === taskToEdit.id ? { ...task, text: values.taskName } : task
      );
      setTasks(updatedTasks);
      setTaskToEdit(null);
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: values.taskName,
      };
      setTasks([...tasks, newTask]);
    }

    setIsDialogOpen(false);
    form.reset();
  }

  function handleDeleteTask(idToDelete: string) {
    const newTasks = tasks.filter((task) => task.id !== idToDelete);
    setTasks(newTasks);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Gerenciador de Tarefas</h1>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) {
            form.reset();
            setTaskToEdit(null);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button>Adicionar Nova Tarefa</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {taskToEdit ? "Editar Tarefa" : "Adicionar nova tarefa"}
            </DialogTitle>
            <DialogDescription>
              {taskToEdit
                ? "Altere o nome da sua tarefa abaixo."
                : "Digite o nome da sua tarefa abaixo"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                control={form.control}
                name="taskName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Tarefa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Estudar React Hook Form"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage /> {}
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {taskToEdit ? "Salvar Alterações" : "Adicionar"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <section
        className="mt-8 w-full max-w-md"
        aria-labelledby="task-list-heading"
      >
        <h2
          id="task-list-heading"
          className="text-2xl font-semibold text-center mb-4"
        >
          Minhas Tarefas
        </h2>
        {tasks.length > 0 ? (
          <ul className="border-t">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-4 border-b"
              >
                <span>{task.text}</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(task)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-center text-gray-500 border-t">
            Nenhuma tarefa ainda.
          </p>
        )}
      </section>
    </main>
  );
}
