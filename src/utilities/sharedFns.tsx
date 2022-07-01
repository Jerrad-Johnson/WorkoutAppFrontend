export function arrayOfOptions(lengthOfArray: number) {
    return Array.from({length: lengthOfArray}).map((_e, k) => {
        return (
            <option key={k}>{k + 1}</option>
        );
    });
}