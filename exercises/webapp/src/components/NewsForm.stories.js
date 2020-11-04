import NewsForm from './NewsForm';

export default {
  title: 'NewsForm',
  component: NewsForm,
  argTypes: {},
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {NewsForm},
  template: '<NewsForm @onClick="onClick" v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {};
