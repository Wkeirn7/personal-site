import { ref } from "vue";

const useIntersectionObserver = () => {
    const observedElement = ref<Element | null>(null);
    const elementClass = ref("");
    const interOptions = (rootPar: null | HTMLElement, thresholdPar: number | number[], rootMargin?: string) => {
        return {
            root: rootPar,
            threshold: thresholdPar,
            rootMargin,
        };
    };

    const interCallback = function (entries?: any) {
        if (entries) {
            const [entry] = entries;

            if (entry.isIntersecting) {
                (observedElement.value as HTMLElement).classList.add(elementClass.value);
            }
        }
    };

    const observer = new IntersectionObserver(interCallback, interOptions as IntersectionObserverInit);
    return {
        observedElement,
        elementClass,
        interOptions,
        interCallback,
        observer,
    };
};
export default useIntersectionObserver;