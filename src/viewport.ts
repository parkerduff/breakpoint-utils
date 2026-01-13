class ViewportHelper {
  private width: number;
  private eventHandlers: (() => void)[];

  constructor() {
    this.width = typeof window !== 'undefined' ? window.innerWidth : 0;
    this.eventHandlers = [];
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
    }
  }

  private handleResize = () => {
    this.width = window.innerWidth;
    this.eventHandlers.forEach(handler => handler());
  };

  getWidth() {
    return this.width;
  }

  onResize(handler: () => void) {
    this.eventHandlers.push(handler);
    return () => {
      this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    };
  }
}

const viewportHelper = new ViewportHelper();
export default viewportHelper;
