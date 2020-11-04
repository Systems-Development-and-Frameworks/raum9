import {
  mount
} from '@vue/test-utils';
import HackerNews from './HackerNews.vue';
import NewsItem from './NewsItem.vue';

describe("Sorting Order", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(HackerNews, {
      data() {
        return {
          ascending: false,
          items: [{
            id: 0,
            title: "Message 1",
            voteCount: 2
          }, {
            id: 1,
            title: "Message 2",
            voteCount: 4
          }],
          id: 2
        };
      }
    });
  });

  it("sorting order", async () => {
    expect(wrapper.findAllComponents(NewsItem).at(0).text()).toContain("Message 2");
    expect(wrapper.findAllComponents(NewsItem).at(1).text()).toContain("Message 1");

    await wrapper.find("#switch-order-button").trigger("click");

    expect(wrapper.findAllComponents(NewsItem).at(0).text()).toContain("Message 1");
    expect(wrapper.findAllComponents(NewsItem).at(1).text()).toContain("Message 2");

    await wrapper.find("#switch-order-button").trigger("click");

    expect(wrapper.findAllComponents(NewsItem).at(0).text()).toContain("Message 2");
    expect(wrapper.findAllComponents(NewsItem).at(1).text()).toContain("Message 1");
  })
});


describe("Placeholder", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(HackerNews, {
      data() {
        return {
          ascending: false,
          items: [{
            id: 0,
            title: "Message 1",
            voteCount: 2,
          }],
          id: 1
        };
      }
    })
  });

  it("Show items", async () => {
    expect(wrapper.findAllComponents(NewsItem).at(0).text()).toContain("Message 1");
  });

  it("Show Placeholder if not items exists", async () => {
    await wrapper.findAllComponents(NewsItem).at(0).find("#remove-button").trigger("click");

    expect(wrapper.findAllComponents(NewsItem).length).toEqual(0);
    expect(wrapper.find("#news-placeholder").text()).toEqual("The list is empty :(");

    await wrapper.find("#news-input").trigger("submit.prevent")
    expect(wrapper.findAllComponents(NewsItem).length).toEqual(1);
    expect(wrapper.find("#news-placeholder").exists()).toEqual(false);
  });
});
