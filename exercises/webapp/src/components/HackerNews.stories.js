import HackerNews from './HackerNews';

export default {
  title: 'HackerNews',
  component: HackerNews,
  argTypes: {
/*    backgroundColor: { control: 'color' },
    size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },*/
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { HackerNews},
  template: '<HackerNews @onClick="onClick" v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {};
