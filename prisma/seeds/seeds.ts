import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  const states = [
    { name: 'Acre', uf: 'AC' },
    { name: 'Alagoas', uf: 'AL' },
    { name: 'Amapá', uf: 'AP' },
    { name: 'Amazonas', uf: 'AM' },
    { name: 'Bahia', uf: 'BA' },
    { name: 'Ceará', uf: 'CE' },
    { name: 'Distrito Federal', uf: 'DF' },
    { name: 'Espírito Santo', uf: 'ES' },
    { name: 'Goiás', uf: 'GO' },
    { name: 'Maranhão', uf: 'MA' },
    { name: 'Mato Grosso', uf: 'MT' },
    { name: 'Mato Grosso do Sul', uf: 'MS' },
    { name: 'Minas Gerais', uf: 'MG' },
    { name: 'Pará', uf: 'PA' },
    { name: 'Paraíba', uf: 'PB' },
    { name: 'Paraná', uf: 'PR' },
    { name: 'Pernambuco', uf: 'PE' },
    { name: 'Piauí', uf: 'PI' },
    { name: 'Rio de Janeiro', uf: 'RJ' },
    { name: 'Rio Grande do Norte', uf: 'RN' },
    { name: 'Rio Grande do Sul', uf: 'RS' },
    { name: 'Rondônia', uf: 'RO' },
    { name: 'Roraima', uf: 'RR' },
    { name: 'Santa Catarina', uf: 'SC' },
    { name: 'São Paulo', uf: 'SP' },
    { name: 'Sergipe', uf: 'SE' },
    { name: 'Tocantins', uf: 'TO' },
  ];

  console.log('🌱 Starting seed of states...');

  for (const state of states) {
    await prisma.state.upsert({
      where: { uf: state.uf },
      update: {},
      create: state,
    });
    console.log(`✅ state ${state.name} (${state.uf}) inserted/updated`);
  }

  console.log('🎉 Seed of states completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
