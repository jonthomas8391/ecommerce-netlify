import axios from "axios"
import uuidv1 from "uuid/v1"

export const state = () => ({
  cartUIStatus: "idle",
  totalAmt: 50,
  cartCount: 0
})

export const mutations = {
  updateCartUI: (state, payload) => {
    state.cartUIStatus = payload
  },
  clearCartCount: state => {
    ;(state.cartCount = 0), (state.totalAmt = 0), (state.cartUIStatus = "idle")
  }
}

export const actions = {
  async postStripeFunction({ state, commit }, payload) {
    console.log(payload)

    try {
      await axios
        .post(
          "https://ecommerce-netlify.netlify.com/.netlify/functions/index",
          {
            stripeEmail: payload.stripeEmail,
            stripeAmt: state.stripeAmt,
            stripeToken: "tok_visa", //testing token, later we would use payload.data.token
            stripeIdempotency: uuidv1() //we use this library to create a unique id
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          commit("updateCartUI", "success")
          commit("clearCartCount")
          console.log(JSON.stringify(res, null, 2))
        })
    } catch (err) {
      console.log(err)
      commit("updateCartUI", "failure")
    }
  }
}
