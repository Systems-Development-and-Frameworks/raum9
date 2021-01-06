import {
  mount
} from '@vue/test-utils';
import HackerNews from '../components/HackerNews.vue';
import NewsItem from '../components/NewsItem.vue';

const createWrapper = (options) => {
  const defaults = {
    propsData: {
      initialNews: [{
        id: 0,
        title: 'Message 1',
        voteCount: 2
      }, {
        id: 1,
        title: 'Message 2',
        voteCount: 4
      }],
    }
  };
  return mount(HackerNews, { ...defaults, ...options });
};

describe('Sorting Order', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = createWrapper({});
  });

  it('sorting order', async () => {
    expect(wrapper.findAll('h2>.news-message').wrappers.map(w => w.text())).toEqual(['Message 2', 'Message 1']);
    await wrapper.find('#switch-order-button').trigger('click');
    expect(wrapper.findAll('h2>.news-message').wrappers.map(w => w.text())).toEqual(['Message 1', 'Message 2']);
    await wrapper.find('#switch-order-button').trigger('click');
    expect(wrapper.findAll('h2>.news-message').wrappers.map(w => w.text())).toEqual(['Message 2', 'Message 1']);
  });
});


describe('Placeholder', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = createWrapper({
      propsData: {
        initialNews: [{
          id: 0,
          title: 'Message 1',
          voteCount: 2,
        }],
      }
    });
  });

  it('Show items', async () => {
    expect(wrapper.findAllComponents(NewsItem).at(0).text()).toContain('Message 1');
  });

  it('Show Placeholder if no item exists', async () => {
    await wrapper.findAllComponents(NewsItem).at(0).find('.remove-button').trigger('click');

    expect(wrapper.findAllComponents(NewsItem).length).toEqual(0);
    expect(wrapper.find('#news-placeholder').text()).toEqual('The list is empty :(');

    await wrapper.find('#news-input').trigger('submit');
    expect(wrapper.findAllComponents(NewsItem).length).toEqual(1);
    expect(wrapper.find('#news-placeholder').exists()).toEqual(false);
  });
});
