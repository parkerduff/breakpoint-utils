class ViewportHelper {
  private width: number;
  private eventHandlers: Set<() => void>;

  constructor() {
    this.width = typeof window !== 'undefined' ? window.innerWidth : 0;
    this.eventHandlers = new Set();
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
    this.eventHandlers.add(handler);
    return () => {
      this.eventHandlers.delete(handler);
    };
  }
}

const viewportHelper = new ViewportHelper();
export default viewportHelper;
