"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
    },
  });

  function onSubmit(values: FormValues) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: values.taskName,
    };

    setTasks([...tasks, newTask]);

    setIsDialogOpen(false);
    form.reset();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Gerenciador de Tarefas</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>Adicionar Nova Tarefa</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
            <DialogDescription>
              Digite o nome da sua tarefa abaixo.
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
                Adicionar
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="mt-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Minhas Tarefas
        </h2>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 border-b"
            >
              <span>{task.text}</span>
              {/* Botoes de editar e deletar */}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhuma tarefa ainda.</p>
        )}
      </div>
    </main>
  );
}
