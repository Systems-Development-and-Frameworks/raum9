import {
  mount
} from '@vue/test-utils';
import HackerNews from './HackerNews.vue';
import NewsItem from './NewsItem.vue';

test('switch order', async () => {
  const wrapper = mount(HackerNews, {
    data() {
      return {
        ascending: false,
        items: [{
          id: 0,
          title: "Message 1",
          voteCount: 2,
        }, {
          id: 1,
          title: "Message 2",
          voteCount: 4,
        }],
        id: 1
      };
    }
  })

  expect(wrapper.findAllComponents(NewsItem).at(0).text()).toContain("Message 2");
  expect(wrapper.findAllComponents(NewsItem).at(1).text()).toContain("Message 1");

  await wrapper.find("#switch-order-button").trigger("click");

  expect(wrapper.findAllComponents(NewsItem).at(0).text()).toContain("Message 1");
  expect(wrapper.findAllComponents(NewsItem).at(1).text()).toContain("Message 2");

  await wrapper.find("#switch-order-button").trigger("click");

  expect(wrapper.findAllComponents(NewsItem).at(0).text()).toContain("Message 2");
  expect(wrapper.findAllComponents(NewsItem).at(1).text()).toContain("Message 1");
})
