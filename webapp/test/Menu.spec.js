import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Menu from '../components/Menu.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe("MenuForm.vue", () => {
  let actions;
  let getters;
  let store;
  const push = jest.fn();
  const logout = jest.fn();

  const setupWrapper = () => {
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state: () => ({
            currentUser: null,
            token: null
          }),
          actions,
          getters
        }
      }
    });
    return shallowMount(Menu,
      {
        store,
        localVue,
        mocks: {
          $router: {
            push
          }
        }
      });
  };

  beforeEach(() => {
    getters = {
      loggedIn: () => true,
      currentUser: () => 1,
    };
    actions = {
      logout
    };
  });

  describe("logout", () => {
    it("Redirects to index after login", async () => {
      const wrapper = setupWrapper();
      await wrapper.find("#logout").trigger("click");
      await expect(logout).toHaveBeenCalled();
    });
  });
});
