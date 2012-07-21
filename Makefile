SRC = src/f.core.js src/f.event.js src/f.mvc.js

COMBINE = src/f.prod.js
COMPRESS = src/f.prod.min.js
 
$(COMBINE) : $(SRC)
	cat $^ > $@

	java -jar /Applications/gcc/compiler.jar --js $(COMBINE) --js_output_file $(COMPRESS)

.PHONY: clean
clean :
	rm -f $(COMBINE) $(COMPRESS)

