const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const { appendToSheet, readSheet } = require('./utils');
const { chat } = require('./chatgpt');

const flowGPT = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        const gastos = await readSheet('Sheet1!A1:C10');
        const prompt = "Eres un asistente financiero y contable que tiene acceso a mis gastos. Te voy a consultar sobre eso.";
        const text = ctx.body + "\n Mis gastos son: " + gastos;
        const response = await chat(prompt, text);
        await ctxFn.flowDynamic(response);
    })

const flowHistory = addKeyword(['Historial'])
    .addAnswer('Este es el flujo de *Historial*', null,
        async (ctx, ctxFn) => {
            const response = await readSheet('Sheet1!A1:C10');
            console.log(response);
        }
    )


const flowPrincipal = addKeyword(['Gastos'])
    .addAnswer('Hola, bienvenido al flujo de *Gastos*')
    .addAnswer('Nombre del gasto: ', { capture: true },
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ name: ctx.body })
        }
    )
    .addAnswer('Monto del gasto: ', { capture: true },
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ amount: ctx.body })
        }
    )
    .addAnswer('Categoría del gasto: ', { capture: true },
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ category: ctx.body })
        }
    ).addAnswer('Gracias. Tus datos fueron registrados', null,
        async (ctx, ctxFn) => {
            const name = ctxFn.state.get("name");
            const amount = ctxFn.state.get("amount");
            const category = ctxFn.state.get("category");
            await appendToSheet([[name, amount, category]]);
        }
    )


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowHistory])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
