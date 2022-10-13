export default {
  name: "RouterLink",
  props: {
    to: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: "a",
    },
  },
  methods: {
    handleJump() {
      this.$router.push(this.to);
    },
  },
  render(h) {
    return h(
      this.tag,
      {
        on: {
          click: () => {
            this.handleJump();
          },
        },
      },
      this.$slots.default
    );
  },
};
