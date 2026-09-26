export function setupCustomSelect(selectId) {
    const select = document.getElementById(selectId);
    const trigger = document.getElementById(`${selectId}-trigger`);
    const menu = document.getElementById(`${selectId}-options`);
    const value = document.getElementById(`${selectId}-value`);
    const label = document.getElementById(`${selectId}-label`);

    if (!select || !trigger || !menu || !value || !label) return;

    const options = [...menu.querySelectorAll('[role="option"]')];

    options.forEach((option) => {
        option.addEventListener("click", () => {
            select.value = option.dataset.value;
            select.dispatchEvent(new Event("change", { bubbles: true }));

            value.textContent = option.textContent;
            options.forEach((item) => {
                item.setAttribute("aria-selected", String(item === option));
            });

            menu.hidden = true;
            trigger.setAttribute("aria-expanded", "false");
            trigger.focus();
        });
    });


    trigger.addEventListener("click", () => {
        const isOpening = menu.hidden;

        menu.hidden = !isOpening;
        trigger.setAttribute("aria-expanded", String(isOpening));

        if (isOpening) {
            const selectedOption = options.find(
                (option) => option.getAttribute("aria-selected") === "true"
            );
            selectedOption?.focus();
        }
    });

    menu.addEventListener("keydown", (event) => {
        const currentIndex = options.indexOf(document.activeElement);

        if (event.key === "Escape" || event.key === "Tab") {
            menu.hidden = true;
            trigger.setAttribute("aria-expanded", "false");

            if (event.key === "Escape") {
                event.preventDefault();
                trigger.focus();
            }
            return;
        }

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const direction = event.key === "ArrowDown" ? 1 : -1;
            const nextIndex =
                (currentIndex + direction + options.length) % options.length;

            options[nextIndex].focus();
        }
    });

    document.addEventListener("pointerdown", (event) => {
        if (!menu.hidden && !select.parentElement.contains(event.target)) {
            menu.hidden = true;
            trigger.setAttribute("aria-expanded", "false");
        }
    });

    value.textContent = select.selectedOptions[0].textContent;
    options.forEach((option) => {
        option.setAttribute(
            "aria-selected",
            String(option.dataset.value === select.value)
        );
    });

    select.hidden = true;
    trigger.hidden = false;
    label.htmlFor = trigger.id;

}
