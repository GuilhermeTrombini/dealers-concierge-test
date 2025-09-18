import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import { prisma } from '../prisma';

export const builder = new SchemaBuilder<{
  PrismaTypes: any;
  Context: {
    prisma: typeof prisma;
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.queryType();
builder.mutationType();
