const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')


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
            console.log(ctxFn.state.get("name"))
            console.log(ctxFn.state.get("amount"))
            console.log(ctxFn.state.get("category"))
        }
    )




const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
