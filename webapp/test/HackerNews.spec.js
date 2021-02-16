import {createLocalVue, mount} from '@vue/test-utils';
import HackerNews from '../components/HackerNews.vue';
import NewsItem from '../components/NewsItem.vue';

import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

const createWrapper = (options) => {
  const getters = {
    loggedIn: () => true,
    currentUser: () => 1,
  };

  const store = new Vuex.Store({
    modules: {
      auth: {
        namespaced: true,
        getters
      }
    }
  });

  const defaults = {
    localVue,
    store,
    propsData: {
      initialNews: [{
        id: 1,
        title: 'Message 1',
        votes: 2,
        author: {
          id: 1
        }
      }, {
        id: 2,
        title: 'Message 2',
        votes: 4,
        author: {
          id: 1
        }
      }],
    }
  };
  return mount(HackerNews, {...defaults, ...options});
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

  it('Show items', () => {
    wrapper = createWrapper({
      propsData: {
        initialNews: [{
          id: 0,
          title: 'Message 1',
          votes: 2,
          author: {
            id: 1
          }
        }],
      }
    });
    expect(wrapper.findAllComponents(NewsItem).at(0).text()).toContain('Message 1');
  });

  it('Show if no item exists', () => {
    wrapper = createWrapper({
      propsData: {
        initialNews: [],
      }
    });
    expect(wrapper.findAllComponents(NewsItem).length).toEqual(0);
    expect(wrapper.find('#news-placeholder').text()).toEqual('The list is empty :(');
  });
});
