import { Elysia, NotFoundError, t } from "elysia";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: Date;
};

let todos: Todo[] = [
  {
    id: "1",
    title: "Buy milk",
    completed: false,
  },
  {
    id: "2",
    title: "Buy eggs",
    completed: true,
  },
  {
    id: "3",
    title: "Buy bread",
    completed: false,
  },
];

const TodoDTO = t.Object({
  title: t.String(),
  completed: t.Optional(t.Boolean()),
});

const WithIdDTO = t.Object({
  id: t.String(),
});

export const api = new Elysia({ prefix: "/api" }).group("/todos", (router) =>
  router
    .get("/", async () => todos, {
      detail: {
        tags: ["Todos"],
      },
    })
    .get(
      "/:id",
      async ({ params }) => {
        const todo = todos.find((todo) => todo.id === params.id);
        if (!todo) throw new NotFoundError();
        return todo;
      },
      {
        params: WithIdDTO,
        detail: {
          tags: ["Todos"],
        },
      },
    )
    .post(
      "/",
      async ({ body }) => {
        const todo = {
          id: crypto.randomUUID(),
          ...body,
          completed: false,
          createdAt: new Date(),
        };
        todos.push(todo);
        return todo;
      },
      {
        body: TodoDTO,
        detail: {
          tags: ["Todos"],
        },
      },
    )
    .put(
      "/:id",
      async ({ params, body }) => {
        const index = todos.findIndex((todo) => todo.id === params.id);
        if (index === -1) throw new NotFoundError();
        todos[index] = { ...todos[index], ...body };
        return todos[index];
      },
      {
        params: WithIdDTO,
        body: t.Partial(TodoDTO),
        detail: {
          tags: ["Todos"],
        },
      },
    )
    .delete(
      "/:id",
      async ({ params }) => {
        const index = todos.findIndex((todo) => todo.id === params.id);
        if (index === -1) throw new NotFoundError();
        todos.splice(index, 1);
      },
      {
        params: WithIdDTO,
        detail: {
          tags: ["Todos"],
        },
      },
    ),
);
