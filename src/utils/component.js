import mithril from 'mithril';

class _KComponent {
  controller (props, children) {
    const {stream} = props;

    this.currentView = mithril.prop([]);
    stream(props, children).onValue((nextView) => {
      mithril.startComputation();
      this.currentView(nextView);
      mithril.endComputation();
    });
  }

  view (controller) {
    const {currentView} = controller;
    return currentView();
  }
}

export default new _KComponent();
