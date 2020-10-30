// Import the `mount()` method from Vue Test Utils
import { mount } from '@vue/test-utils';
import HackerNews from "./HackerNews.vue";


test('displays message', () => {
  // mount() returns a wrapped Vue component we can interact with
  const wrapper = mount(HackerNews, {
    data() {
      return {
        items: [{
          id: 0,
          title: "Start Message",
          voteCount: 0,
        }],
        id: 1
      };
    },
  })

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Start Message')
})
