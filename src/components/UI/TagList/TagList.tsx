import { Link } from '@mui/material'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


interface Props {
    items: string[];
    checked?: string[];
    onChange: (items: string[]) => void;
}

const updateDocumentTitle = (newTitle:string) => {
  document.title = newTitle;
};

const TagList = ({items,checked,onChange}: Props) => {
    const [checkedItems,setCheckedItems] = useState(checked || [])

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tagIDs = urlParams.getAll('tag');
      setCheckedItems(tagIDs);

      if (tagIDs.length > 0) {
        const tagTitle = urlParams.get('tag')?.replace(/-/g, " ");
        updateDocumentTitle(`${tagTitle} | Namiq`);
        setCheckedItems(tagIDs);

        if (items.some((item:any) => item.tagName === tagTitle)) {
        } else {
          navigate('/not-found')
        }
    }
  }, [location,items]);


  function handleChecked(value: string) {
    const urlParams = new URLSearchParams(location.search);
    const formattedValue = value.replace(/\s+/g, '-');

    if (checkedItems.includes(formattedValue)) {
        urlParams.delete('tag');
        setCheckedItems([]);
    } else {
        urlParams.delete('tag');
        urlParams.delete('category');
        urlParams.append('tag', formattedValue);
        setCheckedItems([formattedValue]);
      }

    const tagParam = urlParams.get('tag') ? `tag=${urlParams.get('tag')}` : '';

    const newURL = `/?${tagParam}`;

    navigate(newURL);
    
    onChange(urlParams.getAll('tag'));

    const tagTitle = urlParams.get('tag');
    updateDocumentTitle(tagTitle ? `${tagTitle} | Namiq` : "Hack 'em all");
}

  return (
    <div className="tag__item flex flex-wrap gap-1">
    {items?.map((item:any) => (
      <Link
        onClick={() => handleChecked(item.tagName) }
        key={item.tagID}
      >
            <span className={`badge bg-dark ${
              checkedItems.includes(item.tagName.replace(/ /g, '-')) ? 'active' : ''
            }`}>
            {item.tagName }
            </span>
      </Link>
    ))}
    </div>
  )
}

export default TagList