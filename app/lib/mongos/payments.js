import clientPromise from ".";

let client
let db
let payments


async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = await client.db()
        payments = await db.collection('payments')
    } catch (error) {
        throw new Error('Failed to establish connection to database')
    }
}

;(async () => {
    await init()
})()

//////////////////
//// PAYMENTS ////
//////////////////

export async function getPayments() {
    try {
        if (!payments) await init()
        const results = await payments
        .find({})
        // .limit(50)
        .toArray()

        return { payments: results }
    } catch (error) {
        return { error: 'Failed to fetch payments' }
    }
}