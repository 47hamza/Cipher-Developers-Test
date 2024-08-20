import './home.css'

import React, { useState, useEffect } from "react";
import {
    Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Button,
    Typography,
    Collapse,
} from "@mui/material";

const TaxForm = ({ items }) => {
    const [applyToAll, setApplyToAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState({});
    const [categories, setCategories] = useState({});
    const [taxName, setTaxName] = useState("");
    const [taxPercentage, setTaxPercentage] = useState("");
    const [errors, setErrors] = useState({ taxName: false, taxPercentage: false });

    useEffect(() => {
        // Group items by category
        const groupedItems = items.reduce((acc, item) => {
            const category = item.category ? item.category.name : "Uncategorized";
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});
        setCategories(groupedItems);
    }, [items]);

    const handleCategoryToggle = (category) => {
        const categoryItems = categories[category];
        const isCategorySelected = categoryItems.every((item) =>
            selectedItems[item.id]
        );

        const newSelectedItems = { ...selectedItems };

        categoryItems.forEach((item) => {
            if (isCategorySelected) {
                delete newSelectedItems[item.id];
            } else {
                newSelectedItems[item.id] = true;
            }
        });

        setSelectedItems(newSelectedItems);
    };

    const handleItemToggle = (item) => {
        const newSelectedItems = { ...selectedItems };
        if (newSelectedItems[item.id]) {
            delete newSelectedItems[item.id];
        } else {
            newSelectedItems[item.id] = true;
        }
        setSelectedItems(newSelectedItems);
    };

    const handleSubmit = () => {
        const newErrors = { taxName: !taxName, taxPercentage: !taxPercentage };
        setErrors(newErrors);

        if (newErrors.taxName || newErrors.taxPercentage) {
            alert("Please fill all fields")
            return; // Stop submission if there are validation errors
        }

        const itemsToApplyTax = applyToAll
            ? items
            : items.filter((item) => selectedItems[item.id]);

        const response = {
            applicable_items: itemsToApplyTax,
            applied_to: applyToAll ? "all" : "some",
            name: taxName,
            rate: parseFloat(taxPercentage) / 100,
        };

        console.log(response);
    };

    return (
        <div className="wrapper">
            <Typography variant="h4">Add Tax</Typography>
            <div className="taxInputFields">
                {/*<TextField*/}
                {/*    className="taxIF1"*/}
                {/*    label="Tax Name"*/}
                {/*    value={taxName}*/}
                {/*    onChange={(e) => setTaxName(e.target.value)}*/}
                {/*    // fullWidth*/}
                {/*    margin="normal"*/}
                {/*    required*/}
                {/*/>*/}
                {/*<TextField*/}
                {/*    className="taxIF2"*/}
                {/*    label="Tax Percentage"*/}
                {/*    type="number"*/}
                {/*    value={taxPercentage}*/}
                {/*    onChange={(e) => setTaxPercentage(e.target.value)}*/}
                {/*    // fullWidth*/}
                {/*    margin="normal"*/}
                {/*    required*/}
                {/*/>*/}
                <TextField
                    className="taxIF1"
                    label="Tax Name"
                    value={taxName}
                    onChange={(e) => setTaxName(e.target.value)}
                    margin="normal"
                    required
                    error={errors.taxName}
                    helperText={errors.taxName ? "Tax name is required" : ""}
                />
                <TextField
                    className="taxIF2"
                    label="Tax Percentage"
                    type="number"
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(e.target.value)}
                    margin="normal"
                    required
                    error={errors.taxPercentage}
                    helperText={errors.taxPercentage ? "Tax percentage is required" : ""}
                />
            </div>
            <RadioGroup
                value={applyToAll}
                onChange={(e) => setApplyToAll(e.target.value === "true")}
            >
                <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Apply to all items in collection"
                />
                <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Apply to specific items"
                />
            </RadioGroup>

            <Collapse in={!applyToAll}>
                <TextField
                    label="Search Items"
                    placeholder="Search by item name..."
                    fullWidth
                    margin="normal"
                />
                <br/><br/>
                {Object.keys(categories).map((category) => (
                    <div key={category}>
                        <FormControlLabel
                            style={{background: "lightgray", width: "100%"}}
                            control={
                                <Checkbox
                                    checked={categories[category].every((item) =>
                                        selectedItems[item.id]
                                    )}
                                    onChange={() => handleCategoryToggle(category)}
                                />
                            }
                            label={category}
                        />
                        <div style={{ paddingLeft: 20 }}>
                            {categories[category].map((item) => (
                                <>
                                    <FormControlLabel
                                        key={item.id}
                                        control={
                                            <Checkbox
                                                checked={!!selectedItems[item.id]}
                                                onChange={() => handleItemToggle(item)}
                                            />
                                        }
                                        label={item.name}
                                    />
                                    <br/>
                                </>
                            ))}
                        </div>
                    </div>
                ))}
            </Collapse>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ marginTop: 20 }}
            >
                Apply tax to {applyToAll ? items.length : Object.keys(selectedItems).length} item(s)
            </Button>
        </div>
    );
};

// Example usage with the provided API response
const items = [{"id":14864,"tab_id":3202,"name":"Recurring Item","amount":12.0,"amount_type":"fixed","allow_quantity":null,"deleted_at":null,"required":false,"created_at":"2018-07-02T14:11:00.305Z","updated_at":"2018-06-17T19:19:42.304Z","type":"TabItem","position":1,"anchor":null,"parent_id":null,"catalog_object_id":null,"description":null,"available_quantity":null,"hidden":false,"options":{"recurring":{"enabled":true,"options":{"ends":{"type":"never"},"start":{"type":"first_payment"},"repeatInterval":"P1M"}}},"tsv":"'item':2 'recur':1","quantity_sold":2,"amount_sold":24.0,"total_buyers":1,"quantity_refunded":0,"amount_discounted":0.0,"amount_refunded":0.0,"net_amount":24.0,"net_quantity":2,"subcategory":null,"images":[]},{"id":14865,"tab_id":3202,"name":"Jasinthe Bracelet","amount":26.0,"amount_type":"fixed","allow_quantity":null,"deleted_at":null,"required":false,"created_at":"2018-07-02T14:11:00.309Z","updated_at":"2018-08-11T03:08:39.841Z","type":"TabItem","position":1,"anchor":null,"parent_id":14866,"catalog_object_id":8463,"description":null,"available_quantity":8,"hidden":false,"options":{"makeAvailableQuantityPublic":false},"tsv":"'bracelet':2 'jasinth':1","quantity_sold":11,"amount_sold":286.0,"total_buyers":7,"quantity_refunded":0,"amount_discounted":0.0,"amount_refunded":0.0,"net_amount":286.0,"net_quantity":11,"subcategory":null,"category":{"id":14866,"name":"Bracelets","options":{}},"images":[{"id":5572,"upload_path":"uploads/image/image_file/716/jasinthe_bracelet.jpg","metadata":{},"url":"https://images.cheddarcdn.com/eyJidWNrZXQiOiJjaGVkZGFyLXVwLXJldmlldyIsImtleSI6InVwbG9hZHMvaW1hZ2UvaW1hZ2VfZmlsZS83MTYvamFzaW50aGVfYnJhY2VsZXQuanBnIiwib3V0cHV0Rm9ybWF0IjoianBlZyIsImVkaXRzIjp7ImZsYXR0ZW4iOnsiYmFja2dyb3VuZCI6eyJyIjoyNTUsImciOjI1NSwiYiI6MjU1fX19fQ=="}]},{"id":14867,"tab_id":3202,"name":"Jasinthe Bracelet","amount":26.0,"amount_type":"fixed","allow_quantity":null,"deleted_at":null,"required":false,"created_at":"2018-07-02T14:11:00.317Z","updated_at":"2018-07-10T13:24:53.733Z","type":"TabItem","position":2,"anchor":null,"parent_id":14866,"catalog_object_id":8463,"description":null,"available_quantity":19,"hidden":false,"options":{"makeAvailableQuantityPublic":true},"tsv":"'bracelet':2 'jasinth':1","quantity_sold":1,"amount_sold":26.0,"total_buyers":1,"quantity_refunded":0,"amount_discounted":5.2,"amount_refunded":0.0,"net_amount":20.8,"net_quantity":1,"subcategory":null,"category":{"id":14866,"name":"Bracelets","options":{}},"images":[{"id":5571,"upload_path":"uploads/image/image_file/1742/jasinthe_bracelet.jpg","metadata":{},"url":"https://images.cheddarcdn.com/eyJidWNrZXQiOiJjaGVkZGFyLXVwLXJldmlldyIsImtleSI6InVwbG9hZHMvaW1hZ2UvaW1hZ2VfZmlsZS8xNzQyL2phc2ludGhlX2JyYWNlbGV0LmpwZyIsIm91dHB1dEZvcm1hdCI6ImpwZWciLCJlZGl0cyI6eyJmbGF0dGVuIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NX19fX0="}]},{"id":14868,"tab_id":3202,"name":"Recurring Item with questions","amount":12.0,"amount_type":"fixed","allow_quantity":null,"deleted_at":null,"required":false,"created_at":"2018-07-02T14:11:00.323Z","updated_at":"2018-07-02T14:10:25.296Z","type":"TabItem","position":2,"anchor":null,"parent_id":null,"catalog_object_id":null,"description":null,"available_quantity":null,"hidden":false,"options":{"recurring":{"enabled":true,"options":{"ends":{"type":"payment_count","payment_count":5},"start":{"type":"first_payment"},"repeatInterval":"P1M"}},"makeAvailableQuantityPublic":false},"tsv":"'item':2 'question':4 'recur':1","quantity_sold":0,"amount_sold":0.0,"total_buyers":0,"quantity_refunded":0,"amount_discounted":0.0,"amount_refunded":0.0,"net_amount":0.0,"net_quantity":0,"subcategory":null,"images":[]},{"id":14869,"tab_id":3202,"name":"Zero amount item with questions","amount":0.0,"amount_type":"fixed","allow_quantity":null,"deleted_at":null,"required":false,"created_at":"2018-07-02T14:11:00.334Z","updated_at":"2018-07-02T14:09:09.267Z","type":"TabItem","position":3,"anchor":null,"parent_id":null,"catalog_object_id":null,"description":null,"available_quantity":null,"hidden":false,"options":{"makeAvailableQuantityPublic":false},"tsv":"'amount':2 'item':3 'question':5 'zero':1","quantity_sold":2,"amount_sold":0.0,"total_buyers":2,"quantity_refunded":0,"amount_discounted":0.0,"amount_refunded":0.0,"net_amount":0.0,"net_quantity":2,"subcategory":null,"images":[]},{"id":14870,"tab_id":3202,"name":"Inspire Bracelet","amount":32.0,"amount_type":"fixed","allow_quantity":null,"deleted_at":null,"required":false,"created_at":"2018-07-02T14:11:00.348Z","updated_at":"2018-06-27T16:47:21.731Z","type":"TabItem","position":3,"anchor":null,"parent_id":14866,"catalog_object_id":8462,"description":null,"available_quantity":0,"hidden":false,"options":{},"tsv":"'bracelet':2 'inspir':1","quantity_sold":0,"amount_sold":0.0,"total_buyers":0,"quantity_refunded":0,"amount_discounted":0.0,"amount_refunded":0.0,"net_amount":0.0,"net_quantity":0,"subcategory":null,"category":{"id":14866,"name":"Bracelets","options":{}},"images":[{"id":5570,"upload_path":"uploads/image/image_file/715/inspire_bracelet.jpg","metadata":{},"url":"https://images.cheddarcdn.com/eyJidWNrZXQiOiJjaGVkZGFyLXVwLXJldmlldyIsImtleSI6InVwbG9hZHMvaW1hZ2UvaW1hZ2VfZmlsZS83MTUvaW5zcGlyZV9icmFjZWxldC5qcGciLCJvdXRwdXRGb3JtYXQiOiJqcGVnIiwiZWRpdHMiOnsiZmxhdHRlbiI6eyJiYWNrZ3JvdW5kIjp7InIiOjI1NSwiZyI6MjU1LCJiIjoyNTV9fX19"}]},{"id":14872,"tab_id":3202,"name":"Normal item with questions","amount":55.0,"amount_type":"fixed","allow_quantity":null,"deleted_at":null,"required":false,"created_at":"2018-07-02T14:11:00.365Z","updated_at":"2018-07-02T14:09:46.143Z","type":"TabItem","position":4,"anchor":null,"parent_id":null,"catalog_object_id":null,"description":null,"available_quantity":null,"hidden":false,"options":{"makeAvailableQuantityPublic":false},"tsv":"'item':2 'normal':1 'question':4","quantity_sold":2,"amount_sold":110.0,"total_buyers":2,"quantity_refunded":0,"amount_discounted":22.0,"amount_refunded":0.0,"net_amount":88.0,"net_quantity":2,"subcategory":null,"images":[]},{"id":14873,"tab_id":3202,"name":"normal item ","amount":20.0,"amount_type":"fixed","allow_quantity":null,"deleted_at":null,"required":false,"created_at":"2018-07-02T14:11:00.378Z","updated_at":"2018-06-21T15:38:07.112Z","type":"TabItem","position":5,"anchor":null,"parent_id":null,"catalog_object_id":null,"description":null,"available_quantity":null,"hidden":false,"options":{},"tsv":"'item':2 'normal':1","quantity_sold":1,"amount_sold":20.0,"total_buyers":1,"quantity_refunded":0,"amount_discounted":4.0,"amount_refunded":0.0,"net_amount":16.0,"net_quantity":1,"subcategory":null,"images":[]}]

export default function Home() {
    return <TaxForm items={items} />;
}
