import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import LoginForm from '../components/LoginForm.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe("LoginForm.vue", () => {
  let actions;
  let getters;
  let store;
  const push = jest.fn();

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
    return shallowMount(LoginForm,
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
      loggedIn: () => false,
      currentUser: () => null,
    };
    actions = {
      login: jest.fn()
    };
  });

  describe("login", () => {
    it("Redirects to index after login", async () => {
      const wrapper = setupWrapper();
      await wrapper.find('input#username').setValue('my@mail.com');
      await wrapper.find('input#password').setValue('test1234');
      await wrapper.find("form").trigger("submit");
      await expect(push).toHaveBeenCalledWith('/');
    });
  });
});
